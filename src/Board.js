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
      return count > 1; 
    },

    hasAnyRowConflicts: function() {
      // set size of row
      var size = this.get('n');

      // iterate through all rows
      for ( var i = 0; i < size; i++ ) {
        // if conflict found return true
        if ( this.hasRowConflictAt(i) ) {
          return true;
        }
      }

      return false;
    },

    hasColConflictAt: function(colIndex) {
      // set size of row
      var size = this.get('n');
      var count = 0;

      // iterate through column
      for( var i = 0; i < size; i++ ) {
        // set row i of board
        var row = this.get(i);
        // accumulate column queens;
        count += row[colIndex];
      }


      //if more than 1 queen return true
      return count > 1;
    },

    hasAnyColConflicts: function() {
      // set size of row
      var size = this.get('n');

      // iterate through all columns
      for ( var i = 0; i < size; i ++ ) {
        // if conflict found return true
        if ( this.hasColConflictAt(i) ) {
          return true;
        }
      }

      return false;
    },

    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      // set size of row
      var size = this.get('n');
      // count of major diagonal conflicts
      var count = 0;
      var rowIndex = 0;
      var columnIndex = majorDiagonalColumnIndexAtFirstRow;

      // iterate through rows of major diagonal
      for( ; rowIndex < size && columnIndex < size; rowIndex++, columnIndex++ ){
        // if major diagonal index is within board
        if( columnIndex >= 0 ) {
          // set row to current index
          var row = this.get(rowIndex);
          // accumulate count of queens along major diagonal
          count += row[columnIndex];
        }
      }

      // return major diagonal conflict count boolean
      return count > 1;
    },

    hasAnyMajorDiagonalConflicts: function() {
      // set size of row
      var size = this.get('n');

      // iterate through major diagonals
      for( var i = 1 - size; i < size; i++ ) {
        // if any conflicts on major diagonal return true
        if( this.hasMajorDiagonalConflictAt(i) ) {
          return true;
        }
      }

      // if no conflicts found return false
      return false;
    },

    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      // set size of row
      var size = this.get('n');
      // count of minor diagonal conflicts
      var count = 0;
      var rowIndex = 0;
      var columnIndex = minorDiagonalColumnIndexAtFirstRow;

      // iterate through rows of minor diagonal
      for( ; rowIndex < size && columnIndex >= 0; rowIndex++, columnIndex-- ) {
        // if minor diagonal index is within board
        if( columnIndex < size ) {
          // set row to current index
          var row = this.get(rowIndex);
          // accumulate count of queens along minor diagonal
          count += row[columnIndex];
        }
      }

      // return minor diagonal conflict count boolean
      return count > 1;
    },

    hasAnyMinorDiagonalConflicts: function() {
      // set size of row
      var size = this.get('n');

      // iterate through minor diagonals
      for( var i = (size * 2) - 1; i >= 0; i-- ) {
        // if minor diagonal conflict found return true
        if( this.hasMinorDiagonalConflictAt(i) ) {
          return true;
        }
      }

      // if no conflicts found return false
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
