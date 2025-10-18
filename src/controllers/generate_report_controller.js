import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
// import dotenv from 'dotenv';
import LoginLog from '../models/login_log.js';

import ExcelJS from 'exceljs';

function format_role(role) {
    const roleMap = {
        'admin': 'Admin',
        'resident': 'Resident',
        'enro_staff': 'ENRO Staff',
        'enro_staff_monitoring': 'ENRO Staff Monitoring',
        'enro_staff_scheduler': 'ENRO Staff Scheduler',
        'enro_staff_head': 'ENRO Staff Head',
        'enro_staff_eswm_section_head': 'ENRO Staff ESWM Section Head',
        'barangay_official': 'Barangay Official',
        'garbage_collector': 'Garbage Collector'
    };

    return roleMap[role] || role; // Return formatted role or original if not found
}

function date_logged_in(created_at) {
    const date_logged_in = created_at.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    return date_logged_in;
}

function time_logged_in(created_at) {
    const time_logged_in = created_at.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    return time_logged_in;
}




export const generate_report_login_log = asyncHandler(async (req, res) => {
    const { start_date, end_date } = req.body;

    try {
        if (!start_date || !end_date) {
            return res.status(400).json({ message: "Please provide all fields (start_date, end_date)." });
        }

        const startDateString = `${start_date} 00:00:00`;
        const endDateString = `${end_date} 23:59:59`;

        const logs = await LoginLog.find({
            created_at: {
                $gte: startDateString,
                $lte: endDateString,
            },
        })
            .populate('user')
            .populate({
                path: 'user',
                populate: {
                    path: 'role_action',
                    model: 'Action'
                }
            });


        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Login Logs Report');

        worksheet.columns = [
            { key: 'log_id', width: 30 },
            { key: 'complete_name', width: 25 },
            { key: 'role_type', width: 20 },
            { key: 'role_action_type', width: 20 },
            { key: 'date_logged_in', width: 15 },
            { key: 'time_logged_in', width: 15 },
            { key: 'device', width: 20 },
            { key: 'platform', width: 20 },
            { key: 'operating_system', width: 20 },
            { key: 'status', width: 15 },
            { key: 'remark', width: 25 },
        ];

        // Header
        const headerRow = worksheet.addRow(['LOGIN ACTIVITY REPORT']);
        headerRow.font = { size: 16, bold: true };
        headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.mergeCells('A1:B1');

        worksheet.addRow(['Generated Date:', new Date().toLocaleDateString()]);
        worksheet.addRow(['Total Records:', logs.length]);
        worksheet.addRow(['Prepared By:', 'System Administrator']);
        worksheet.addRow([]);

        const tableHeaderRow = worksheet.addRow([
            'Log ID', 'Complete Name', 'Account Type', 'Role Action',
            'Date Logged In', 'Time Logged In', 'Device', 'Platform', 'Operating System',
            'Status', 'Remark'
        ]);
        tableHeaderRow.font = { bold: true };
        tableHeaderRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6FA' }
        };

        // Add log data
        logs.forEach(log => {
            worksheet.addRow({
                log_id: log._id.toString(),
                complete_name: `${log.user.first_name} ${log.user.middle_name} ${log.user.last_name}`,
                role_type: format_role(log.user.role),
                role_action_type: log.user?.role_action?.action_name || "None",
                date_logged_in: date_logged_in(new Date(log.created_at)),
                time_logged_in: time_logged_in(new Date(log.created_at)),
                device: log.device,
                platform: log.platform,
                operating_system: log.os,
                status: log.status,
                remark: log.remark
            });
        });

        // Summary
        worksheet.addRow([]);
        const summaryRow = worksheet.addRow([
            'SUMMARY',
            `Total Records: ${logs.length}`,
            '', '', '', '', '', '', '', '', `Generated: ${new Date().toLocaleDateString()}`
        ]);
        summaryRow.font = { bold: true };

        // Style all cells
        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
            });
        });

        // Auto-fit columns except column A
        worksheet.columns.forEach((column, index) => {
            if (index === 0) return; // Skip column A
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const colLen = cell.value ? cell.value.toString().length : 10;
                if (colLen > maxLength) maxLength = colLen;
            });
            column.width = Math.min(maxLength + 2, 50);
        });

        worksheet.getColumn(1).width = 30; // Set column A width manually

        // Create reports directory if not exists
        // const reportsDir = path.join(__dirname, '../reports');
        // try {
        //     await fs.access(reportsDir);
        // } catch {
        //     await fs.mkdir(reportsDir, { recursive: true });
        // }

        // Save file to server
        // const timestamp = Date.now();
        // const fileName = `login-logs-report-${timestamp}.xlsx`;
        // const filePath = path.join(reportsDir, fileName);
        // await workbook.xlsx.writeFile(filePath);

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=login-logs-report-${Date.now()}.xlsx`
        );

        await workbook.xlsx.write(res);
        res.end();

        // Respond with JSON including file URL for frontend to download
        // return res.status(200).json({ data: "success" });
    } catch (error) {
        console.error('Error generating login logs report:', error);
        return res.status(500).json({ message: 'Failed to generate login logs report.', error });
    }
});




export const generate_report_login_log_specific_user = asyncHandler(async (req, res) => {
    const { user_id } = req.params; // Get the meal ID from the request parameters
    const { start_date, end_date } = req.body;

    try {
        if (!start_date || !end_date) {
            return res.status(400).json({ message: "Please provide all fields (start_date, end_date)." });
        }

        const startDateString = `${start_date} 00:00:00`;
        const endDateString = `${end_date} 23:59:59`;

        const logs = await LoginLog.find({
            user: user_id,
            created_at: {
                $gte: startDateString,
                $lte: endDateString,
            },
        })
            .populate('user')
            .populate({
                path: 'user',
                populate: {
                    path: 'role_action',
                    model: 'Action'
                }
            });


        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Login Logs Report');

        worksheet.columns = [
            { key: 'log_id', width: 30 },
            { key: 'complete_name', width: 25 },
            { key: 'role_type', width: 20 },
            { key: 'role_action_type', width: 20 },
            { key: 'date_logged_in', width: 15 },
            { key: 'time_logged_in', width: 15 },
            { key: 'device', width: 20 },
            { key: 'platform', width: 20 },
            { key: 'operating_system', width: 20 },
            { key: 'status', width: 15 },
            { key: 'remark', width: 25 },
        ];

        // Header
        const headerRow = worksheet.addRow(['LOGIN ACTIVITY REPORT']);
        headerRow.font = { size: 16, bold: true };
        headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.mergeCells('A1:B1');

        worksheet.addRow(['Generated Date:', new Date().toLocaleDateString()]);
        worksheet.addRow(['Total Records:', logs.length]);
        worksheet.addRow(['Prepared By:', 'System Administrator']);
        worksheet.addRow([]);

        const tableHeaderRow = worksheet.addRow([
            'Log ID', 'Complete Name', 'Account Type', 'Role Action',
            'Date Logged In', 'Time Logged In', 'Device', 'Platform', 'Operating System',
            'Status', 'Remark'
        ]);
        tableHeaderRow.font = { bold: true };
        tableHeaderRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6FA' }
        };

        // Add log data
        logs.forEach(log => {
            worksheet.addRow({
                log_id: log._id.toString(),
                complete_name: `${log.user.first_name} ${log.user.middle_name} ${log.user.last_name}`,
                role_type: format_role(log.user.role),
                role_action_type: log.user?.role_action?.action_name || "None",
                date_logged_in: date_logged_in(new Date(log.created_at)),
                time_logged_in: time_logged_in(new Date(log.created_at)),
                device: log.device,
                platform: log.platform,
                operating_system: log.os,
                status: log.status,
                remark: log.remark
            });
        });

        // Summary
        worksheet.addRow([]);
        const summaryRow = worksheet.addRow([
            'SUMMARY',
            `Total Records: ${logs.length}`,
            '', '', '', '', '', '', '', '', `Generated: ${new Date().toLocaleDateString()}`
        ]);
        summaryRow.font = { bold: true };

        // Style all cells
        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
            });
        });

        // Auto-fit columns except column A
        worksheet.columns.forEach((column, index) => {
            if (index === 0) return; // Skip column A
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const colLen = cell.value ? cell.value.toString().length : 10;
                if (colLen > maxLength) maxLength = colLen;
            });
            column.width = Math.min(maxLength + 2, 50);
        });

        worksheet.getColumn(1).width = 30; // Set column A width manually

        // Create reports directory if not exists
        // const reportsDir = path.join(__dirname, '../reports');
        // try {
        //     await fs.access(reportsDir);
        // } catch {
        //     await fs.mkdir(reportsDir, { recursive: true });
        // }

        // Save file to server
        // const timestamp = Date.now();
        // const fileName = `login-logs-report-${timestamp}.xlsx`;
        // const filePath = path.join(reportsDir, fileName);
        // await workbook.xlsx.writeFile(filePath);

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=login-logs-report-${Date.now()}.xlsx`
        );

        await workbook.xlsx.write(res);
        res.end();

        // Respond with JSON including file URL for frontend to download
        // return res.status(200).json({ data: "success" });
    } catch (error) {
        console.error('Error generating login logs report:', error);
        return res.status(500).json({ message: 'Failed to generate login logs report.', error });
    }
});


