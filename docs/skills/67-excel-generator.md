# Skill: excel-generator

## Purpose
Generates Excel/spreadsheet solutions — creates formulas, builds entire workbooks, designs dashboards, creates pivot table setups, and writes VBA/macro code for automation. Also generates CSV data and Google Sheets equivalents.

## When to Use
- Need a specific Excel formula that you can't figure out
- Need a template (budget, tracker, invoice, dashboard)
- Need to automate repetitive Excel tasks with macros
- Need to build a data analysis spreadsheet
- Need CSV data for testing or import
- Need Google Sheets-compatible formulas

## Core Capabilities
| Task | Output |
|------|--------|
| Formula Building | Complex nested formulas with explanations |
| Template Creation | Full workbook structure with sheets + headers |
| Dashboard Design | Instructions for charts, KPIs, slicers |
| VBA/Macro Code | Automation scripts with comments |
| Data Validation | Dropdowns, conditional formatting rules |
| Pivot Table Setup | Step-by-step pivot configuration |
| CSV Generation | Sample data for any business domain |
| XLOOKUP/VLOOKUP | Lookup formula with explanation |

## Usage Examples

```
"Create a budget tracker spreadsheet for a student with monthly income and expense categories"
"Write an Excel formula to find all duplicate values in column A"
"Generate sample CSV data for 100 e-commerce orders with Indian names and addresses"
"Create a VBA macro to auto-send emails when column C is marked 'Done'"
"Build a student grade sheet with automatic GPA calculation"
```

## Essential Excel Formula Reference

### Lookup & Reference
```excel
=VLOOKUP(A2, SheetB!A:C, 2, FALSE)           "Find value in table"
=XLOOKUP(A2, Sheet2!A:A, Sheet2!B:B)         "Modern VLOOKUP (Excel 2019+)"
=INDEX(B:B, MATCH(D2, A:A, 0))              "Flexible two-column lookup"
=HLOOKUP(A1, A1:E5, 2, FALSE)               "Horizontal lookup"
```

### Text Functions
```excel
=TRIM(A1)                                    "Remove extra spaces"
=PROPER(A1)                                  "Capitalize each word"
=LEFT(A1, 3)                                 "First 3 characters"
=MID(A1, 2, 5)                               "5 chars starting from position 2"
=CONCATENATE(A1, " ", B1)                    "Join text"
=A1&" "&B1                                   "Shorthand join"
=TEXTJOIN(", ", TRUE, A1:A10)               "Join range with delimiter"
=TEXT(A1, "DD-MMM-YYYY")                    "Format date as text"
```

### Math & Stats
```excel
=SUMIF(A:A, "India", B:B)                   "Sum where condition met"
=SUMIFS(B:B, A:A, "India", C:C, ">100")    "Sum with multiple conditions"
=COUNTIF(A:A, "Yes")                         "Count where condition met"
=AVERAGEIF(A:A, ">18", B:B)                 "Average with condition"
=PERCENTILE(A:A, 0.9)                        "90th percentile"
=STDEV(A:A)                                  "Standard deviation"
=CORREL(A:A, B:B)                           "Correlation coefficient"
```

### Date Functions
```excel
=TODAY()                                     "Today's date"
=NOW()                                       "Current date + time"
=DATEDIF(A1, B1, "D")                       "Days between dates"
=EDATE(A1, 3)                               "Date 3 months from A1"
=EOMONTH(A1, 0)                             "Last day of month"
=WEEKDAY(A1, 2)                             "Day of week (1=Mon)"
=NETWORKDAYS(A1, B1)                        "Working days between dates"
```

### Advanced Formulas
```excel
=ARRAYFORMULA(A1:A10*B1:B10)              "Apply formula to range (Sheets)"
=FILTER(A:C, B:B="India")                  "Filter rows by condition"
=SORT(A:C, 2, -1)                          "Sort by col 2 descending"
=UNIQUE(A:A)                               "Get unique values"
=SEQUENCE(10, 1, 1, 1)                     "Generate number sequence"
=LET(x, A1*B1, y, C1+D1, x+y)           "Named variables in formula"
```

## Spreadsheet Templates

### Student Budget Tracker
```
Sheet 1: DASHBOARD
  - Monthly income vs expenses chart
  - Category breakdown pie chart
  - Savings rate gauge

Sheet 2: TRANSACTIONS
  Headers: Date | Category | Description | Amount | Type (Income/Expense)
  
Sheet 3: CATEGORIES
  - Budget allocation per category
  - Actual vs budget comparison

Sheet 4: SUMMARY
  - Monthly totals by category
  - Year-to-date totals
```

### Grade Calculator
```
Headers: Subject | Max Marks | Marks Obtained | Percentage | Grade | Credits
Formula (Grade): =IF(G2>=90,"A+",IF(G2>=80,"A",IF(G2>=70,"B+",IF(G2>=60,"B","C"))))
Formula (SGPA): =SUMPRODUCT(credits*grade_points)/SUM(credits)
```

## VBA Macro Examples
```vba
' Auto-format data table
Sub FormatTable()
    With Range("A1").CurrentRegion
        .Font.Name = "Calibri"
        .Borders.LineStyle = xlContinuous
        .Rows(1).Font.Bold = True
        .Rows(1).Interior.Color = RGB(0, 122, 255)
    End With
End Sub

' Export each sheet as separate CSV
Sub ExportSheets()
    Dim ws As Worksheet
    For Each ws In Worksheets
        ws.Copy
        ActiveWorkbook.SaveAs Filename:=ws.Name & ".csv", _
            FileFormat:=xlCSV
        ActiveWorkbook.Close False
    Next ws
End Sub
```

## ISHU TOOLS Integration
- "Excel Formula Generator" tool: user enters what they want to do → get the formula
- "CSV Data Generator" tool: user specifies fields → generates sample CSV

## Related Skills
- `pdf` — PDF ↔ Excel conversion
- `data tools` — data analysis and processing
- `invoice-generator` — invoice in spreadsheet format
