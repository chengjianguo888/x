"""无人机作业管理系统 - Flask 应用"""

import copy
import secrets
from dataclasses import asdict
from datetime import date, datetime

from flask import (
    Flask,
    flash,
    jsonify,
    redirect,
    render_template,
    request,
    session,
    url_for,
)

from mock_data import (
    drone_performance_data,
    flight_trend_data,
    mission_type_data,
    mock_alerts,
    mock_drones,
    mock_flight_data,
    mock_maintenance_records,
    mock_missions,
    mock_reports,
    mock_users,
)
from models import (
    Alert,
    Drone,
    DroneLocation,
    MaintenanceRecord,
    Mission,
    MissionWeather,
    Report,
    User,
)

app = Flask(__name__)
app.secret_key = secrets.token_hex(32)

# ── 内存数据存储（模拟数据库）──────────────────────────

_store: dict = {
    'users': copy.deepcopy(mock_users),
    'drones': copy.deepcopy(mock_drones),
    'missions': copy.deepcopy(mock_missions),
    'flight_data': copy.deepcopy(mock_flight_data),
    'alerts': copy.deepcopy(mock_alerts),
    'reports': copy.deepcopy(mock_reports),
    'maintenance': copy.deepcopy(mock_maintenance_records),
}

# ── 辅助工具 ──────────────────────────────────────────

STATUS_LABELS = {
    'idle': '空闲', 'flying': '飞行中', 'charging': '充电中',
    'maintenance': '维护中', 'offline': '离线',
    'planned': '已计划', 'in_progress': '进行中', 'completed': '已完成',
    'cancelled': '已取消', 'paused': '已暂停',
    'scheduled': '已安排', 'overdue': '已逾期',
    'active': '活跃', 'inactive': '停用',
    'generating': '生成中', 'ready': '就绪', 'failed': '失败',
}

STATUS_COLORS = {
    'flying': 'bg-cyan-500', 'idle': 'bg-green-500',
    'charging': 'bg-yellow-500', 'maintenance': 'bg-orange-500',
    'offline': 'bg-red-500',
    'in_progress': 'bg-cyan-500', 'planned': 'bg-blue-500',
    'completed': 'bg-green-500', 'cancelled': 'bg-gray-500',
    'paused': 'bg-yellow-500',
    'scheduled': 'bg-blue-500', 'overdue': 'bg-red-500',
    'active': 'bg-green-500', 'inactive': 'bg-gray-500',
    'generating': 'bg-yellow-500', 'ready': 'bg-green-500',
    'failed': 'bg-red-500',
    'warning': 'bg-yellow-500', 'error': 'bg-red-500',
    'info': 'bg-cyan-500', 'success': 'bg-green-500',
    'low': 'bg-gray-500', 'medium': 'bg-yellow-500',
    'high': 'bg-orange-500', 'critical': 'bg-red-500',
}

MISSION_TYPE_LABELS = {
    'inspection': '巡检', 'mapping': '测绘', 'delivery': '配送',
    'surveillance': '监控', 'agriculture': '农业', 'search_rescue': '搜救',
}

MAINTENANCE_TYPE_LABELS = {
    'routine': '例行保养', 'repair': '维修', 'upgrade': '升级', 'inspection': '巡检',
}

REPORT_TYPE_LABELS = {
    'mission': '任务报告', 'fleet': '机队报告', 'maintenance': '维护报告',
    'performance': '性能报告', 'monthly': '月度报告',
}

PRIORITY_LABELS = {
    'low': '低', 'medium': '中', 'high': '高', 'critical': '紧急',
}

ROLE_LABELS = {
    'admin': '管理员', 'operator': '操作员', 'viewer': '观察者',
}

DEPARTMENT_LIST = ['系统管理部', '飞行作业部', '数据分析部', '设备维护部']


def _find(lst: list, id_val: str):
    return next((item for item in lst if item.id == id_val), None)


def _obj_to_dict(obj):
    """将 dataclass 转为字典，递归处理嵌套 dataclass"""
    if hasattr(obj, '__dataclass_fields__'):
        return asdict(obj)
    return obj


@app.context_processor
def inject_helpers():
    """注入模板全局变量"""
    user = None
    if 'user_id' in session:
        user = _find(_store['users'], session['user_id'])
    unresolved_alerts = sum(1 for a in _store['alerts'] if not a.resolved)
    return {
        'current_user': user,
        'unresolved_alerts': unresolved_alerts,
        'status_label': STATUS_LABELS,
        'status_color': STATUS_COLORS,
        'mission_type_label': MISSION_TYPE_LABELS,
        'maintenance_type_label': MAINTENANCE_TYPE_LABELS,
        'report_type_label': REPORT_TYPE_LABELS,
        'priority_label': PRIORITY_LABELS,
        'role_label': ROLE_LABELS,
        'now': datetime.now(),
    }


def login_required(f):
    """登录保护装饰器"""
    from functools import wraps

    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated


# ── 认证路由 ──────────────────────────────────────────

@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    error = None
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()
        found = next(
            (u for u in _store['users']
             if u.username == username and u.status == 'active'),
            None,
        )
        if found and password in ('admin123', 'password'):
            session['user_id'] = found.id
            found.last_login = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            flash(f'欢迎回来，{found.name}！', 'success')
            return redirect(url_for('dashboard'))
        error = '用户名或密码错误'
    return render_template('login.html', error=error)


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


# ── 数据概览 ──────────────────────────────────────────

@app.route('/')
@login_required
def dashboard():
    drones = _store['drones']
    missions = _store['missions']
    alerts = _store['alerts']

    active_drones = sum(1 for d in drones if d.status == 'flying')
    missions_today = [m for m in missions if m.start_time.startswith('2026-03-08')]
    completed_today = sum(1 for m in missions_today if m.status == 'completed')
    unresolved = sum(1 for a in alerts if not a.resolved)
    total_data = sum(m.data_collected or 0 for m in missions)

    stats = {
        'total_drones': len(drones),
        'active_drones': active_drones,
        'missions_today_completed': completed_today,
        'missions_today_total': len(missions_today),
        'unresolved_alerts': unresolved,
        'data_collected': round(total_data, 1),
        'fleet_health': 92,
    }

    return render_template(
        'dashboard.html',
        stats=stats,
        drones=drones,
        missions=missions[:5],
        flight_trend=flight_trend_data,
        mission_types=mission_type_data,
        drone_performance=drone_performance_data,
    )


# ── 实时监控 ──────────────────────────────────────────

@app.route('/monitor')
@login_required
def monitor():
    flying = [d for d in _store['drones'] if d.status == 'flying']
    selected_id = request.args.get('drone', flying[0].id if flying else None)
    selected = _find(_store['drones'], selected_id) if selected_id else None
    flight_data = [fd for fd in _store['flight_data'] if fd.drone_id == selected_id][-30:]
    return render_template(
        'monitor.html',
        flying_drones=flying,
        selected=selected,
        flight_data=flight_data,
        flight_data_dicts=[_obj_to_dict(fd) for fd in flight_data],
    )


# ── 任务管理 ──────────────────────────────────────────

@app.route('/missions')
@login_required
def missions_page():
    status_filter = request.args.get('status', 'all')
    search = request.args.get('q', '').strip()
    type_filter = request.args.get('type', 'all')

    result = list(_store['missions'])
    if status_filter != 'all':
        result = [m for m in result if m.status == status_filter]
    if type_filter != 'all':
        result = [m for m in result if m.type == type_filter]
    if search:
        q = search.lower()
        result = [m for m in result if q in m.name.lower()
                  or q in m.drone_name.lower() or q in m.pilot_name.lower()]

    counts = {}
    for m in _store['missions']:
        counts[m.status] = counts.get(m.status, 0) + 1

    return render_template(
        'missions.html', missions=result, counts=counts,
        status_filter=status_filter, search=search, type_filter=type_filter,
        drones=_store['drones'],
    )


@app.route('/missions/create', methods=['POST'])
@login_required
def create_mission():
    user = _find(_store['users'], session['user_id'])
    drone = _find(_store['drones'], request.form.get('drone_id', ''))
    mid = f'm{len(_store["missions"]) + 1}'
    mission = Mission(
        id=mid,
        name=request.form.get('name', '').strip(),
        type=request.form.get('type', 'inspection'),
        status='planned',
        drone_id=drone.id if drone else '',
        drone_name=drone.name if drone else '',
        pilot_id=user.id if user else '',
        pilot_name=user.name if user else '',
        start_time=request.form.get('start_time', '').replace('T', ' '),
        planned_duration=int(request.form.get('planned_duration', 60)),
        description=request.form.get('description', '').strip(),
        priority=request.form.get('priority', 'medium'),
    )
    _store['missions'].append(mission)
    flash('任务创建成功！', 'success')
    return redirect(url_for('missions_page'))


@app.route('/missions/<mid>/status', methods=['POST'])
@login_required
def update_mission_status(mid):
    mission = _find(_store['missions'], mid)
    if mission:
        new_status = request.form.get('status', mission.status)
        mission.status = new_status
        if new_status == 'completed':
            mission.progress = 100
            mission.end_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        flash(f'任务状态已更新为 {STATUS_LABELS.get(new_status, new_status)}', 'success')
    return redirect(url_for('missions_page'))


# ── 机队管理 ──────────────────────────────────────────

@app.route('/drones')
@login_required
def drones_page():
    status_filter = request.args.get('status', 'all')
    search = request.args.get('q', '').strip()

    result = list(_store['drones'])
    if status_filter != 'all':
        result = [d for d in result if d.status == status_filter]
    if search:
        q = search.lower()
        result = [d for d in result if q in d.name.lower() or q in d.model.lower()]

    counts = {}
    for d in _store['drones']:
        counts[d.status] = counts.get(d.status, 0) + 1

    return render_template(
        'drones.html', drones=result, counts=counts,
        status_filter=status_filter, search=search,
    )


@app.route('/drones/create', methods=['POST'])
@login_required
def create_drone():
    did = f'd{len(_store["drones"]) + 1}'
    drone = Drone(
        id=did,
        name=request.form.get('name', '').strip(),
        model=request.form.get('model', '').strip(),
        serial_number=request.form.get('serial_number', '').strip(),
        status='idle',
        battery_level=100,
        total_flight_hours=0,
        total_flights=0,
        purchase_date=date.today().isoformat(),
        next_maintenance_date=request.form.get('next_maintenance_date', ''),
        max_payload=float(request.form.get('max_payload', 0)),
        max_speed=int(request.form.get('max_speed', 0)),
        max_range=int(request.form.get('max_range', 0)),
        max_altitude=int(request.form.get('max_altitude', 0)),
    )
    _store['drones'].append(drone)
    flash('设备添加成功！', 'success')
    return redirect(url_for('drones_page'))


@app.route('/drones/<did>/status', methods=['POST'])
@login_required
def update_drone_status(did):
    drone = _find(_store['drones'], did)
    if drone:
        new_status = request.form.get('status', drone.status)
        drone.status = new_status
        flash(f'{drone.name} 状态已更新为 {STATUS_LABELS.get(new_status, new_status)}', 'success')
    return redirect(url_for('drones_page'))


# ── 数据分析 ──────────────────────────────────────────

@app.route('/data')
@login_required
def data_page():
    drone_filter = request.args.get('drone', 'all')
    page = int(request.args.get('page', 1))
    per_page = 10

    result = list(_store['flight_data'])
    if drone_filter != 'all':
        result = [fd for fd in result if fd.drone_id == drone_filter]

    total = len(result)
    total_pages = max(1, (total + per_page - 1) // per_page)
    page = max(1, min(page, total_pages))
    paginated = result[(page - 1) * per_page: page * per_page]

    return render_template(
        'data.html',
        flight_data=paginated,
        flight_data_all_dicts=[_obj_to_dict(fd) for fd in result],
        page=page, total_pages=total_pages, total=total,
        drone_filter=drone_filter,
        drones=_store['drones'],
    )


# ── 维护记录 ──────────────────────────────────────────

@app.route('/maintenance')
@login_required
def maintenance_page():
    status_filter = request.args.get('status', 'all')
    result = list(_store['maintenance'])
    if status_filter != 'all':
        result = [r for r in result if r.status == status_filter]

    counts = {}
    for r in _store['maintenance']:
        counts[r.status] = counts.get(r.status, 0) + 1

    return render_template(
        'maintenance.html', records=result, counts=counts,
        status_filter=status_filter, drones=_store['drones'],
    )


@app.route('/maintenance/create', methods=['POST'])
@login_required
def create_maintenance():
    drone = _find(_store['drones'], request.form.get('drone_id', ''))
    rid = f'mr{len(_store["maintenance"]) + 1}'
    record = MaintenanceRecord(
        id=rid,
        drone_id=drone.id if drone else '',
        drone_name=drone.name if drone else '',
        type=request.form.get('type', 'routine'),
        status='scheduled',
        scheduled_date=request.form.get('scheduled_date', ''),
        description=request.form.get('description', '').strip(),
        technician=request.form.get('technician', '').strip() or None,
        cost=float(request.form.get('cost', 0) or 0),
    )
    _store['maintenance'].append(record)
    flash('维护计划创建成功！', 'success')
    return redirect(url_for('maintenance_page'))


@app.route('/maintenance/<rid>/status', methods=['POST'])
@login_required
def update_maintenance_status(rid):
    record = _find(_store['maintenance'], rid)
    if record:
        new_status = request.form.get('status', record.status)
        record.status = new_status
        if new_status == 'completed':
            record.completed_date = date.today().isoformat()
        flash(f'维护状态已更新为 {STATUS_LABELS.get(new_status, new_status)}', 'success')
    return redirect(url_for('maintenance_page'))


# ── 报告中心 ──────────────────────────────────────────

@app.route('/reports')
@login_required
def reports_page():
    type_filter = request.args.get('type', 'all')
    result = list(_store['reports'])
    if type_filter != 'all':
        result = [r for r in result if r.type == type_filter]
    return render_template('reports.html', reports=result, type_filter=type_filter)


@app.route('/reports/generate', methods=['POST'])
@login_required
def generate_report():
    user = _find(_store['users'], session['user_id'])
    rid = f'r{len(_store["reports"]) + 1}'
    report = Report(
        id=rid,
        name=request.form.get('name', '').strip(),
        type=request.form.get('type', 'mission'),
        status='ready',
        created_at=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        created_by=user.name if user else '',
        period=request.form.get('period', ''),
    )
    _store['reports'].append(report)
    flash('报告已生成！', 'success')
    return redirect(url_for('reports_page'))


# ── 用户管理 ──────────────────────────────────────────

@app.route('/users')
@login_required
def users_page():
    user = _find(_store['users'], session['user_id'])
    if not user or user.role != 'admin':
        flash('只有管理员可以访问用户管理页面', 'error')
        return redirect(url_for('dashboard'))

    role_filter = request.args.get('role', 'all')
    result = list(_store['users'])
    if role_filter != 'all':
        result = [u for u in result if u.role == role_filter]

    return render_template(
        'users.html', users=result, role_filter=role_filter,
        departments=DEPARTMENT_LIST,
    )


@app.route('/users/create', methods=['POST'])
@login_required
def create_user():
    uid = f'u{len(_store["users"]) + 1}'
    new_user = User(
        id=uid,
        username=request.form.get('username', '').strip(),
        name=request.form.get('name', '').strip(),
        role=request.form.get('role', 'viewer'),
        email=request.form.get('email', '').strip(),
        phone=request.form.get('phone', '').strip() or None,
        department=request.form.get('department', '') or None,
        status='active',
        created_at=date.today().isoformat(),
    )
    _store['users'].append(new_user)
    flash(f'用户 {new_user.name} 创建成功！', 'success')
    return redirect(url_for('users_page'))


@app.route('/users/<uid>/delete', methods=['POST'])
@login_required
def delete_user(uid):
    if uid == 'u1':
        flash('无法删除超级管理员', 'error')
        return redirect(url_for('users_page'))
    if uid == session.get('user_id'):
        flash('无法删除当前登录用户', 'error')
        return redirect(url_for('users_page'))
    _store['users'] = [u for u in _store['users'] if u.id != uid]
    flash('用户已删除', 'success')
    return redirect(url_for('users_page'))


@app.route('/users/<uid>/toggle', methods=['POST'])
@login_required
def toggle_user_status(uid):
    user = _find(_store['users'], uid)
    if user and uid != 'u1':
        user.status = 'inactive' if user.status == 'active' else 'active'
        flash(f'{user.name} 状态已更新', 'success')
    return redirect(url_for('users_page'))


# ── 系统设置 ──────────────────────────────────────────

@app.route('/settings')
@login_required
def settings_page():
    return render_template('settings.html')


# ── 告警 API ─────────────────────────────────────────

@app.route('/alerts/<aid>/resolve', methods=['POST'])
@login_required
def resolve_alert(aid):
    alert = _find(_store['alerts'], aid)
    if alert:
        alert.resolved = True
        flash('告警已处理', 'success')
    return redirect(request.referrer or url_for('dashboard'))


# ── 启动 ──────────────────────────────────────────────

if __name__ == '__main__':
    import os
    app.run(debug=os.environ.get('FLASK_DEBUG', '0') == '1', host='0.0.0.0', port=5000)
