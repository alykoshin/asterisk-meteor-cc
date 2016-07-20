'use strict';


Template.cdrList.helpers({

  cdr() {
    return Cdr.find({}, {
      sort: { starttime: -1 },
      start: 0,
      limit: 50,
    } );
  },

  filelink() {
    const path = 'http://172.20.200.13:3001/'; 
    return path + this.recordingfile;
  },

});

