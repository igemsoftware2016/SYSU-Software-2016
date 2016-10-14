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

cnt += 1 + numEnv

time = sheet.cell(cnt, 1).value
print time
print ""

cnt += 1

matNum = int(sheet.cell(cnt, 1).value)

for i in xrange(cnt + 1, cnt + 1 + matNum):
    mater_name = sheet.cell(i, 0).value
    con = sheet.cell(i, 1).value
    print mater_name, con

#{"design_id":"1","mode":"resolve","inputs":[{"name":"PYRROLINE-HYDROXY-CARBOXYLATE","begin":"2"},{"name":"VANILLATE","begin":"4"},{"name":"L-DELTA1-PYRROLINE_5-CARBOXYLATE","begin":"6"}],"other":{"time":"20","medium":"1","env":["THREO-DS-ISO-CITRATE","DEOXYGUANOSINE","1-KESTOTRIOSE"]}}

#{"design_id":"2","mode":"make","inputs":[{"name":"CARBON-DIOXIDE","lower":"2","upper":"4","maxim":true},{"name":"PYRUVATE","lower":"2","upper":"3","maxim":false}],"other":{"time":"32","medium":"6","env":["DIHYDROXY-ACETONE-PHOSPHATE"]}}
