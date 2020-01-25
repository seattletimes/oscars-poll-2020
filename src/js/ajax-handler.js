var sheetID = "sheet-id";

//called on web request
function doGet(e) {
  if (!e && !e.parameter) return;
  //lock the sheet
  var lock = LockService.getPublicLock();
  lock.tryLock(30 * 1000);
  
  var sheet = SpreadsheetApp.openById(sheetID).getActiveSheet();
  var params = e.parameter;
  var row = [ Date.now(), params.seahawks, params.patriots ];
  sheet.appendRow(row);
  
  lock.releaseLock();
  
  //return JSONP if given callback, otherwise plain JSON
  var output = ContentService.createTextOutput();
  var rowContents = JSON.stringify(row);
  if (params.callback) {
    output.setContent(params.callback + "(" + rowContents + ")");
    output.setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    output.setContent(rowContents);
    output.setMimeType(ContentService.MimeType.JSON);
  }
  return output;
}

function doPost(e) {
  return doGet(e);
}