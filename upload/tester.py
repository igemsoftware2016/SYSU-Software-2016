from xlrd import open_workbook

book = open_workbook('state_1_template.xlsx')
sheet = book.sheet_by_index(0)

isProduct = (sheet.cell(0,1) == 'Products')
numMater = sheet.cell(0,3)

for i in xrange(2, 2 + numMater):
    mater_name = 

for i in xrange(sheet.nrows):
    print 'ROW', i
    for j in xrange(sheet.ncols):
        print sheet.cell(i, j).value

