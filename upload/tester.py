from xlrd import open_workbook

book = open_workbook('state_1_template.xlsx')
sheet = book.sheet_by_index(0)

isProduct = (sheet.cell(0,1) == 'Products')
numMater = int(sheet.cell(0,3).value)

for i in xrange(2, 2 + numMater):
    mater_name = sheet.cell(i, 0).value
    init_con = sheet.cell(i, 1).value
    lower = sheet.cell(i, 2).value
    upper = sheet.cell(i, 3).value
    max_con = sheet.cell(i, 4).value
    print mater_name, init_con, lower, upper, max_con

cnt = 2 + numMater + 1

numEnv = int(sheet.cell(cnt, 1).value)

for i in xrange(cnt + 1, cnt + 1 + numEnv):
    envBtr = sheet.cell(i, 0).value
    print envBtr

cnt += 1 + numEnv + 1

matNum = int(sheet.cell(cnt, 1).value)

for i in xrange(cnt + 1, cnt + 1 + matNum):
    mater_name = sheet.cell(i, 0).value
    con = sheet.cell(i, 1).value
    print mater_name, con

