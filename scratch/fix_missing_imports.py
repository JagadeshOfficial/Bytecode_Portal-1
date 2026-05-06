import os
import re

FILES_TO_FIX = [
    "./app/student/page.tsx",
    "./app/admin/page.tsx",
    "./app/super-admin/academic/page.tsx",
    "./app/super-admin/users/page.tsx",
    "./app/super-admin/live/room/[id]/page.tsx",
    "./app/super-admin/live/page.tsx",
    "./app/super-admin/batches/page.tsx",
    "./app/super-admin/modules/page.tsx",
    "./app/super-admin/page.tsx",
    "./app/tutor/assignments/page.tsx",
    "./app/tutor/salary/page.tsx",
    "./app/tutor/tests/page.tsx",
    "./app/tutor/students/page.tsx",
    "./app/tutor/page.tsx",
    "./app/login/page.tsx",
    "./components/Enterprise/Tracking/GlobalLogCenter.tsx",
    "./components/Enterprise/ByteChat/ByteChat.tsx",
    "./components/Academic/PinpointDashboard.tsx",
    "./components/Academic/MockInterviews/MockInterviewEngine.tsx",
    "./components/Academic/AttendanceManager.tsx",
    "./components/Academic/Exams/TestExaminationEngine.tsx",
    "./components/Academic/Exams/ExamAnalytics.tsx",
    "./components/Academic/Exams/TestCreationWizard.tsx",
    "./components/Academic/Exams/TestDashboard.tsx",
    "./components/Academic/Exams/ExamManagement.tsx",
    "./components/Academic/Exams/MonitoringCenter.tsx",
    "./components/DashboardLayout.tsx",
    "./components/BytecodeMeetingRoom.tsx",
    "./components/Games/GamesDashboard.tsx"
]

IMPORT_STATEMENT = "import { API_URLS } from '@/lib/api-config';\n"

def fix_file(file_path):
    full_path = os.path.join("/Users/bytecode/.gemini/antigravity/scratch/Bytecode-Trainings/frontend/src", file_path)
    if not os.path.exists(full_path):
        print(f"File not found: {full_path}")
        return

    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if "import { API_URLS }" in content:
        return

    new_content = content
    # Insert after the first "use client" or at the top
    if '"use client"' in content or "'use client'" in content:
        new_content = re.sub(r'("use client"|\'use client\');?', r'\1;\n' + IMPORT_STATEMENT, content)
    else:
        new_content = IMPORT_STATEMENT + content

    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Added import to {file_path}")

for f in FILES_TO_FIX:
    fix_file(f)
