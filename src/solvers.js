window.findSolution = function(row, n, board, validator, callback) {
  // if row === n return out of current loop;
  if(row === n) {
    return callback();
  }


  // iterate over possible piece placements
  for(var i = 0; i < n; i++) {
    // place a piece
    board.togglePiece(row, i);
    // only recurse to correct solutions
    if( !board[validator]() ) {
      // recurse to remaining row(s)
      var result = findSolution(row + 1, n, board, validator, callback);
      if( result ) {
        return result;
      }
    }
    // unplace piece
    board.togglePiece(row,i);
  }
};

window.findNRooksSolution = function(n) {
  // create a board with n number of rooks
  var solution = new Board({n: n});
  for(var i = 0; i < n; i++) {
    // place all rooks on diagonal line [i][i]
    solution.togglePiece(i, i);
  }

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution.rows();
};

window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  // create an nxn board
  var board = new Board({n: n});

  // recurse through all solutions of decision tree and count correct
  findSolution(0, n, board, 'hasAnyRooksConflicts', function(){
    solutionCount++;
  });

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

window.findNQueensSolution = function(n) {
  var board = new Board({n: n});

  // find first solution and return from callback
  var solution = findSolution(0, n, board, 'hasAnyQueensConflicts', function(){
    // set solution to be a correct board
    return _.map(board.rows(), function(row) {
      return row.slice();
    });
    // if solution not possible return an empty board
  }) || board.rows();

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

window.countNQueensSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board({n: n});

  // recurse through all solutions of decision tree and count correct
  findSolution(0, n, board, 'hasAnyQueensConflicts', function(){
    solutionCount++;
  });


  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
