/**
 * Google Apps Script for Frame Builders Payment & Tracking System (Supports UPI & PayPal)
 * 
 * Instructions:
 * 1. Open Google Sheets (sheets.google.com).
 * 2. Click Extensions > Apps Script.
 * 3. Delete any default code and paste this code.
 * 4. Click Save (disk icon).
 * 5. Run "setupSheet" once by selecting it in the toolbar and clicking "Run" to initialize.
 * 6. Click Deploy > New deployment.
 * 7. Select "Web app" as deployment type.
 * 8. Set Description, execute as "Me" (your email), and set Access to "Anyone".
 * 9. Click Deploy, copy the Web app URL, and paste it into your website's js/main.js (APPS_SCRIPT_WEB_APP_URL).
 * 
 * Note: PayPal transactions are backward-compatible and will automatically log
 * price in USD (e.g., "$2.15") and Transaction ID (e.g., "PAYID-... (PayPal)") into the existing columns.
 */

function setupSheet(sheetName) {
  sheetName = sheetName || "Orders";
  var ss;
  try {
    // Attempt to connect to the active spreadsheet (for container-bound script)
    ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      // Fallback if script is run outside Google Sheets
      ss = SpreadsheetApp.openById("18PI9VKJpaXVoTrdQWptOvF9wahiUfPPsqSwjxtM_OrM");
    }
  } catch (err) {
    try {
      ss = SpreadsheetApp.openById("18PI9VKJpaXVoTrdQWptOvF9wahiUfPPsqSwjxtM_OrM");
    } catch (e) {
      throw new Error("Could not connect to Google Sheet. Please verify that this script is run from inside a Google Sheet (Extensions > Apps Script) or that the spreadsheet ID is valid and accessible.");
    }
  }

  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    var headers = [];
    if (sheetName === "Orders") {
      headers = [
        "Order ID", 
        "Date", 
        "Service", 
        "Quantity", 
        "Price (INR)", 
        "Target Link/User", 
        "Contact Number", 
        "UTR/Transaction ID", 
        "Status"
      ];
    } else if (sheetName === "Reviews") {
      headers = ["Date", "Name", "Role", "Rating", "Review Text", "Approved"];
    }
    sheet.appendRow(headers);
    
    // Style headers
    var range = sheet.getRange(1, 1, 1, headers.length);
    range.setFontWeight("bold");
    range.setBackground(sheetName === "Orders" ? "#1E66FF" : "#7C3AED");
    range.setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  var response = {};
  try {
    var payload;
    
    // Check if POST data is raw body JSON or form parameter
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else {
      payload = e.parameter;
    }
    
    var action = payload.action;
    
    if (action === "addReview") {
      var name = payload.name;
      var role = payload.role || "";
      var rating = payload.rating;
      var reviewText = payload.reviewText;
      
      if (!name || !rating || !reviewText) {
        throw new Error("Missing required review fields");
      }
      
      var reviewSheet = setupSheet("Reviews");
      var timestamp = new Date();
      var rowData = [
        timestamp,
        name,
        role,
        rating,
        reviewText,
        "Yes" // Approved defaults to Yes so it is visible immediately. Admin can edit this in the spreadsheet.
      ];
      reviewSheet.appendRow(rowData);
      
      response = {
        status: "success",
        message: "Review added successfully"
      };
    } else {
      // Default: Create Order
      var orderId = payload.orderId;
      var service = payload.service;
      var quantity = payload.quantity;
      var price = payload.price;
      var target = payload.target;
      var contact = payload.contact;
      var utr = payload.utr;
      
      if (!orderId || !service || !quantity || !price || !target || !contact || !utr) {
        throw new Error("Missing required order fields");
      }
      
      var orderSheet = setupSheet("Orders");
      var timestamp = new Date();
      var rowData = [
        orderId,
        timestamp,
        service,
        quantity,
        price,
        target,
        contact,
        utr,
        "Pending" // Default status
      ];
      orderSheet.appendRow(rowData);
      
      response = {
        status: "success",
        message: "Order logged successfully",
        orderId: orderId
      };
    }
  } catch (error) {
    response = {
      status: "error",
      message: error.toString()
    };
  }
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var response = {};
  try {
    var action = e.parameter.action;
    
    if (action === "trackOrder") {
      var orderId = e.parameter.orderId;
      if (!orderId) {
        throw new Error("Missing orderId");
      }
      
      var orderSheet = setupSheet("Orders");
      var data = orderSheet.getDataRange().getValues();
      var found = false;
      
      // Loop through spreadsheet rows (skip header row 0)
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == orderId) {
          response = {
            status: "success",
            orderId: data[i][0],
            date: data[i][1],
            service: data[i][2],
            quantity: data[i][3],
            price: data[i][4],
            target: data[i][5],
            contact: data[i][6],
            utr: data[i][7],
            orderStatus: data[i][8] // E.g., Pending, Processing, Completed
          };
          found = true;
          break;
        }
      }
      
      if (!found) {
        response = {
          status: "not_found",
          message: "Order ID not found in database."
        };
      }
    } else if (action === "getReviews") {
      var reviewSheet = setupSheet("Reviews");
      var data = reviewSheet.getDataRange().getValues();
      var reviews = [];
      
      // Loop (skip header row 0)
      for (var i = 1; i < data.length; i++) {
        var approved = data[i][5];
        if (approved === "Yes" || approved === true) {
          reviews.push({
            date: data[i][0],
            name: data[i][1],
            role: data[i][2] || "",
            rating: data[i][3],
            reviewText: data[i][4]
          });
        }
      }
      
      response = {
        status: "success",
        reviews: reviews
      };
    } else {
      response = {
        status: "error",
        message: "Invalid or missing action parameter"
      };
    }
  } catch (error) {
    response = {
      status: "error",
      message: error.toString()
    };
  }
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
