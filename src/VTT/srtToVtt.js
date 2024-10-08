export function srtToVtt(srtText) {
    // Add VTT header at the beginning of the SRT file
    let vttText = "WEBVTT\n\n";
  
    // Replace commas with periods, convert time format to VTT
    vttText += srtText
      .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2") // Convert commas to periods
      .replace(/\r\n|\r|\n/g, '\n'); // Standardize line breaks to \n
  
    return vttText;
  }
  