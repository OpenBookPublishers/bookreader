// 
// This file shows the minimum you need to provide to BookReader to display a book
//
// Copyright(c)2008-2009 Internet Archive. Software license AGPL version 3.
// Copyright(c) 2015 Open Book Publishers

// Create the BookReader object
var br = new BookReader();

br.logoURL = 'http://www.openbookpublishers.com';

// Return the width of a given page.  Here we assume all images are 800 pixels wide
br.getPageWidth = function(index) {
    return 800;
}

// Return the height of a given page.  Here we assume all images are 1200 pixels high
br.getPageHeight = function(index) {
    return 1200;
}

// We load the images (pages) from given URL prefix. Images are successively
// numbered, starting with 0.
br.getPageURI = function(index, reduce, rotate) {
    // reduce and rotate are ignored in this simple implementation, but we
    // could e.g. look at reduce and load images from a different directory
    // or pass the information to an image server
    var leafStr = '000';            
    var imgStr = index.toString();
    var re = new RegExp("0{"+imgStr.length+"}$");
    var url = 'http://www.openbookpublishers.com/bookreader/BookReaderTestResolution/DiderotRameausNephew-'+ imgStr + '.jpg';
    return url;
}

// Return which side, left or right, that a given page should be displayed on
br.getPageSide = function(index) {
    if (0 == (index & 0x1)) {
        return 'R';
    } else {
        return 'L';
    }
}

// This function returns the left and right indices for the user-visible
// spread that contains the given index.  The return values may be
// null if there is no facing page or the index is invalid.
br.getSpreadIndices = function(pindex) {   
    var spreadIndices = [null, null]; 
    if ('rl' == this.pageProgression) {
        // Right to Left
        if (this.getPageSide(pindex) == 'R') {
            spreadIndices[1] = pindex;
            spreadIndices[0] = pindex + 1;
        } else {
            // Given index was LHS
            spreadIndices[0] = pindex;
            spreadIndices[1] = pindex - 1;
        }
    } else {
        // Left to right
        if (this.getPageSide(pindex) == 'L') {
            spreadIndices[0] = pindex;
            spreadIndices[1] = pindex + 1;
        } else {
            // Given index was RHS
            spreadIndices[1] = pindex;
            spreadIndices[0] = pindex - 1;
        }
    }
    
    return spreadIndices;
}

// For a given "accessible page index" return the page number in the book.
//
// For example, index 5 might correspond to "Page 1" if there is front matter such
// as a title page and table of contents.
br.getPageNum = function(index) {
    return index+1;
}

// Total number of leafs
br.numLeafs = 177;

// Book title and the URL used for the book title link
br.bookTitle = "Denis Diderot's 'Rameau's Nephew'";
br.bookUrl = 'http://www.openbookpublishers.com/product/216';

// Base URL of the online book.
br.bookBaseURL = "http://openbookpublishers.com/bookreader/BookReaderDemo";

// Override the path used to find UI images
br.imagesBaseURL = '../BookReader/images/';

br.disable_click_pageflip = true;
br.title_text = 'Visit the homepage for "' + br.bookTitle + '" for downloads, additional resources, purchase options, and more ..';
br.logo_text = '';

metadata_file_URL = "http://openbookpublishers.com/bookreader/BookReader/diderot-linkmetadata.json";

br.getEmbedCode = function(frameWidth, frameHeight, viewParams) {
    return "Embed code not supported in bookreader demo.";
}

// This function is called back when the JSON-encoded book metadata download has
// been completed.
function load_book (link_mdata_json) {
    window.br.link_mdata = link_mdata_json;

    // Let's go!
    window.br.init();

    // read-aloud and search need backend compenents and are not supported in the demo
    $('#BRtoolbar').find('.read').hide();
    $('#textSrch').hide();
    $('#btnSrch').hide();
}

// First download the JSON-encoded book metadata, before loading the rest of the
// book.
$.ajax({
    type : "GET",
    dataType : "json",
    url : metadata_file_URL,
    success : load_book,
    error : function() {
      alert('Could not load book data, please try refreshing this page.');
    }
});
