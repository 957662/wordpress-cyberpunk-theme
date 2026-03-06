"""
System monitoring and management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
import psutil
import platform
import time
from datetime import datetime

from ...core.deps import get_current_user
from ...core.config import settings

router = APIRouter()


class SystemInfo(BaseModel):
    """System information model"""
    hostname: str
    system: str
    release: str
    version: str
    machine: str
    processor: str
    python_version: str


class CPUInfo(BaseModel):
    """CPU information model"""
    percent: float
    count_physical: int
    count_logical: int
    freq_current: float
    freq_max: float
    freq_min: float


class MemoryInfo(BaseModel):
    """Memory information model"""
    total: int
    available: int
    used: int
    free: int
    percent: float


class DiskInfo(BaseModel):
    """Disk information model"""
    total: int
    used: int
    free: int
    percent: float
    mountpoint: str


class ProcessInfo(BaseModel):
    """Process information model"""
    pid: int
    name: str
    status: str
    cpu_percent: float
    memory_percent: float
    create_time: float
    num_threads: int


class SystemStatusResponse(BaseModel):
    """Complete system status response"""
    timestamp: datetime
    uptime: float
    system: SystemInfo
    cpu: CPUInfo
    memory: MemoryInfo
    disk: List[DiskInfo]
    load_average: Optional[List[float]] = None


class LogEntry(BaseModel):
    """Log entry model"""
    level: str
    message: str
    timestamp: datetime
    module: Optional[str] = None


# Application start time
_app_start_time = time.time()


@router.get("/system/info", response_model=SystemInfo)
async def get_system_info(current_user: dict = Depends(get_current_user)):
    """
    Get system information

    Requires authentication.
    """
    return SystemInfo(
        hostname=platform.node(),
        system=platform.system(),
        release=platform.release(),
        version=platform.version(),
        machine=platform.machine(),
        processor=platform.processor(),
        python_version=platform.python_version()
    )


@router.get("/system/cpu", response_model=CPUInfo)
async def get_cpu_info(current_user: dict = Depends(get_current_user)):
    """
    Get CPU usage information

    Requires authentication.
    """
    cpu_freq = psutil.cpu_freq()

    return CPUInfo(
        percent=psutil.cpu_percent(interval=1),
        count_physical=psutil.cpu_count(logical=False),
        count_logical=psutil.cpu_count(logical=True),
        freq_current=cpu_freq.current if cpu_freq else 0,
        freq_max=cpu_freq.max if cpu_freq else 0,
        freq_min=cpu_freq.min if cpu_freq else 0
    )


@router.get("/system/memory", response_model=MemoryInfo)
async def get_memory_info(current_user: dict = Depends(get_current_user)):
    """
    Get memory usage information

    Requires authentication.
    """
    mem = psutil.virtual_memory()

    return MemoryInfo(
        total=mem.total,
        available=mem.available,
        used=mem.used,
        free=mem.free,
        percent=mem.percent
    )


@router.get("/system/disk", response_model=List[DiskInfo])
async def get_disk_info(current_user: dict = Depends(get_current_user)):
    """
    Get disk usage information for all partitions

    Requires authentication.
    """
    disks = []
    partitions = psutil.disk_partitions()

    for partition in partitions:
        try:
            usage = psutil.disk_usage(partition.mountpoint)
            disks.append(DiskInfo(
                total=usage.total,
                used=usage.used,
                free=usage.free,
                percent=usage.percent,
                mountpoint=partition.mountpoint
            ))
        except PermissionError:
            continue

    return disks


@router.get("/system/status", response_model=SystemStatusResponse)
async def get_system_status(current_user: dict = Depends(get_current_user)):
    """
    Get complete system status including CPU, memory, and disk information

    Requires authentication.
    """
    # System info
    system_info = SystemInfo(
        hostname=platform.node(),
        system=platform.system(),
        release=platform.release(),
        version=platform.version(),
        machine=platform.machine(),
        processor=platform.processor(),
        python_version=platform.python_version()
    )

    # CPU info
    cpu_freq = psutil.cpu_freq()
    cpu_info = CPUInfo(
        percent=psutil.cpu_percent(interval=0.5),
        count_physical=psutil.cpu_count(logical=False),
        count_logical=psutil.cpu_count(logical=True),
        freq_current=cpu_freq.current if cpu_freq else 0,
        freq_max=cpu_freq.max if cpu_freq else 0,
        freq_min=cpu_freq.min if cpu_freq else 0
    )

    # Memory info
    mem = psutil.virtual_memory()
    memory_info = MemoryInfo(
        total=mem.total,
        available=mem.available,
        used=mem.used,
        free=mem.free,
        percent=mem.percent
    )

    # Disk info
    disk_info = []
    partitions = psutil.disk_partitions()
    for partition in partitions:
        try:
            usage = psutil.disk_usage(partition.mountpoint)
            disk_info.append(DiskInfo(
                total=usage.total,
                used=usage.used,
                free=usage.free,
                percent=usage.percent,
                mountpoint=partition.mountpoint
            ))
        except PermissionError:
            continue

    # Load average (Unix only)
    load_avg = None
    if hasattr(psutil, 'getloadavg'):
        try:
            load_avg = list(psutil.getloadavg())
        except:
            pass

    return SystemStatusResponse(
        timestamp=datetime.utcnow(),
        uptime=time.time() - _app_start_time,
        system=system_info,
        cpu=cpu_info,
        memory=memory_info,
        disk=disk_info,
        load_average=load_avg
    )


@router.get("/system/processes")
async def get_running_processes(
    limit: int = 10,
    current_user: dict = Depends(get_current_user)
):
    """
    Get list of running processes sorted by CPU usage

    Requires authentication.
    """
    processes = []

    for proc in psutil.process_iter(['pid', 'name', 'status', 'cpu_percent', 'memory_percent', 'create_time', 'num_threads']):
        try:
            proc_info = proc.info
            processes.append(ProcessInfo(
                pid=proc_info['pid'],
                name=proc_info['name'],
                status=proc_info['status'],
                cpu_percent=proc_info['cpu_percent'] or 0,
                memory_percent=proc_info['memory_percent'] or 0,
                create_time=proc_info['create_time'],
                num_threads=proc_info['num_threads'] or 0
            ))
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

    # Sort by CPU usage and return top N
    processes.sort(key=lambda p: p.cpu_percent, reverse=True)
    return processes[:limit]


@router.post("/system/cache/clear")
async def clear_cache(current_user: dict = Depends(get_current_user)):
    """
    Clear application cache (if caching is enabled)

    Requires authentication.
    """
    # This would integrate with your cache manager
    # For now, it's a placeholder
    from ...core.cache_manager import cache_manager

    try:
        await cache_manager.clear_all()
        return {
            "message": "Cache cleared successfully",
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to clear cache: {str(e)}"
        )


@router.get("/system/metrics")
async def get_system_metrics(
    interval: int = 60,
    current_user: dict = Depends(get_current_user)
):
    """
    Get system metrics for monitoring

    Args:
        interval: Time interval in seconds for metrics aggregation

    Requires authentication.
    """
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "interval": interval,
        "metrics": {
            "cpu_percent": psutil.cpu_percent(interval=0.1),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent if platform.system() != 'Windows' else psutil.disk_usage('C:').percent,
            "boot_time": psutil.boot_time(),
            "users_count": len(psutil.users())
        }
    }
