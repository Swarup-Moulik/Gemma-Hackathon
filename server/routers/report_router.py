from controllers.report_controller import (
    delete_report_by_id,
    get_all_reports_list,
    get_report_by_id,
)
from fastapi import APIRouter

router = APIRouter()


@router.get("/reports")
async def get_reports():
    return await get_all_reports_list()


@router.get("/reports/{report_id}")
async def get_report(report_id: str):
    return await get_report_by_id(report_id)


@router.delete("/reports/{report_id}")
async def delete_report(report_id: str):
    return await delete_report_by_id(report_id)
