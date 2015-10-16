// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },

    hasRowConflictAt: function(rowIndex) {
      // set row at rowIndex
      var row = this.get(rowIndex);
      var count = 0;

      // iterate through row
      for ( var i = 0; i < row.length; i++ ) {
        // add all row items (queens are 1)
        count += row[i];
      }

      //if more than 1 queen return true
      return count > 1 ? true : false; 
    },

    hasAnyRowConflicts: function() {
      // grab board (allRows)
      var allRows  = this.rows();
      var count = 0;

      // iterate through all rows
      for ( var i=0; i<allRows.length; i++ ) {
        // if conflict found
        if ( this.hasRowConflictAt(i) ) {
          // add to count of conflicts
          count ++;
        }
      }

      // if any conflicts return true
      return count > 0 ? true : false;
    },

    hasColConflictAt: function(colIndex) {
      // grab board (allRows)
      var allRows = this.rows();
      var count = 0;

      // iterate through column (colIndex)
      for ( var i=0; i < allRows.length; i++ ) {
        // add all column items (queens are 1)
        count += allRows[i][colIndex];
      }

      //if more than 1 queen return true
      return count > 1 ? true : false;
    },

    hasAnyColConflicts: function() {
      // grab row length (n)
      var n = this.get('n');
      var count = 0;

      // iterate through all columns
      for ( var i = 0; i < n; i ++ ) {
        // if conflict found
        if ( this.hasColConflictAt(i) ) {
          // add to count of conflicts
          count++;
        }
      }

      // if any conflicts return true
      return (count > 0) ? true : false;
    },

    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      // grab row length
      var n = this.get('n');
      // grab board (allRows)
      var allRows = this.rows();
      // set major diagonal start index
      var col = majorDiagonalColumnIndexAtFirstRow;
      var count = 0;

      // iterate through rows of major diagonal
      for ( var row = 0; row < n ; row++ ) {
        // if major diagonal index is >= 0
        if (col >= 0) {
          // if piece on major diagonal is a queen
          if ( allRows[row][col] === 1 ) {
            // add to count of queens
            count++;
            // if there are more than 1 queen
            if (count > 1) {
              // return true to exit loop
              return true;
            }
          }
        }
        // increment through major diagonal
        col++;
      }

      // if more than 1 queen on major diagonal return true
      return (count > 1) ? true : false;
    },

    hasAnyMajorDiagonalConflicts: function() {
      // get row length
      var n = this.get('n');
      // start point of major diagonals
      var start = -n + 1;

      // iterate through major diagonals
      for( var col = start; col < n; col++ ) {
        // if any conflicts on major diagonal return true
        if( this.hasMajorDiagonalConflictAt(col) ) {
          return true;
        }
      }
      // if no conflicts found return false
      return false;
    },

    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      // get row length
      var n = this.get('n');
      // get board (allRows)
      var allRows = this.rows();
      // get minor diagonal index
      var col = minorDiagonalColumnIndexAtFirstRow;
      var count = 0;

      // iterate through rows of minor diagonal
      for ( var row = 0; row < n ; row++ ) {
        // if 
        if ( col < n ) {
          // if piece on minor diagonal is queen
          if ( allRows[row][col] === 1 ) {
            // add to count of queens
            count++;
            // if more than 1 queen
            if (count > 1) {
              // return true to exit loop
              return true;
            }
          }
        }
        
        // decrement through minor diagonal
        col--;
      }

      return false;
    },

    hasAnyMinorDiagonalConflicts: function() {
      // get row length
      var n = this.get('n');
      // start point of minor diagonal
      var start = (n * 2) - 1;

      // iterate through minor diagonals
      for( var col = start; col >= 0; col-- ) {
        // if minor diagonal conflict found return true
        if( this.hasMinorDiagonalConflictAt(col) ) {
          return true;
        }
      }

      return false;
    }

  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
