Should I clear t// ─────────────────────────────────────────────────────────────
// OOCM Dashboard — Google Apps Script
// Paste this into Extensions → Apps Script in your Google Sheet
// Deploy as Web App → Execute as Me → Anyone → Deploy
// Copy the URL → Render env var: SHEETS_WEBHOOK_URL
// ─────────────────────────────────────────────────────────────

const HEADERS = {
  Signups:  ['Timestamp', 'ID', 'Name', 'Email', 'Phone', 'Follower Range', 'Categories'],
  Logins:   ['Timestamp', 'Name', 'Email', 'Login Method', 'Profile Complete'],
  Profiles: ['Timestamp', 'ID', 'Name', 'Email', 'Phone', 'Instagram', 'IG Followers', 'Avg Likes/Reel', 'Avg Likes/Post', 'Monthly Reach'],
  'Raw Log':['Timestamp', 'Event', 'Full Data'],
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Always write raw log
    appendRow(ss, 'Raw Log', [
      data.timestamp || new Date().toISOString(),
      data.event,
      JSON.stringify(data),
    ]);

    if (data.event === 'creator_signup_complete') {
      appendRow(ss, 'Signups', [
        data.timestamp,
        data.creator_id,
        data.name,
        data.email,
        data.phone,
        data.follower_range || '',
        data.content_categories || '',
      ]);
    }

    if (data.event === 'creator_login' || data.event === 'creator_login_password') {
      appendRow(ss, 'Logins', [
        data.timestamp,
        data.name || '',
        data.email,
        data.event === 'creator_login_password' ? 'Password' : 'Email OTP',
        data.profile_complete ? 'Yes' : 'No',
      ]);
    }

    if (data.event === 'profile_completed') {
      appendRow(ss, 'Profiles', [
        data.timestamp,
        data.creator_id,
        data.name,
        data.email,
        data.phone,
        data.instagram_username || '',
        data.ig_followers || '',
        data.avg_likes_reels || '',
        data.avg_likes_posts || '',
        data.monthly_reach || '',
      ]);
    }

    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err.toString());
  }
}

function appendRow(ss, tabName, row) {
  let sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    const headers = HEADERS[tabName];
    if (headers) {
      sheet.appendRow(headers);
      // Pink header row to match OOCM brand
      sheet.getRange(1, 1, 1, headers.length)
        .setBackground('#f3a5bc')
        .setFontWeight('bold')
        .setFontColor('#0a0a0a')
        .setFontSize(11);
      sheet.setFrozenRows(1);
    }
  }
  sheet.appendRow(row);
}
