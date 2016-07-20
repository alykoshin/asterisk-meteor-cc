'use strict';


Template.cdrList.helpers({
  cdr() {
    return Cdr.find({}, {
      sort: { starttime: -1 },
      start: 0,
      limit: 50,
    } );
  },
});

