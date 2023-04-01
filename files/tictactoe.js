// TICTACTOE page

function playgame(){
    // Cleaning
    $("#field").children().remove();
    $('#msgs').html('');
    // Making playfield
    var n = 3;
    for (i = 1; i <= n; i++){
        $("<tr id='" + i + "'></td>").appendTo("#field");
        for (j = 1; j <= n; j++){
            var id = i + '' + j;
            $("<td id='" + id + "'></td>").appendTo("#" + i);
            $('#'+id).attr({
                onclick: "game(id)",
                class: "gamecell"
                });
        }
    }
}

    // Game
function game(id){
//     var cell = document.getElementById(id);
    var cell = $('#' + id);
    var x = document.createElement('h1');
//     if (cell.innerHTML == ''){
    if (!$('#' + id).html()){
        $('<h1>X</h1>').appendTo('#' + id);
        $('h1:contains("X")').css('color', 'var(--bs-blue)');
//         x.innerHTML = "X";
//         x.style.color = 'var(--bs-blue)';
//         cell.appendChild(x);

        // Check if X won.  if not - continue
        var xwin = false;
        // search rows and columns simultaniously
        for (let i = 1; i < 4; i++){
            let xcount = 0;
            let xcount2 = 0;
            for (let j = 1; j < 4; j++){
//                 if  (/X/.test(document.getElementById(i+''+j).innerHTML)){
                if (/X/.test($("#" + i + '' + j).html())){
                    xcount++;
                }
//                 if (/X/.test(document.getElementById(j+''+i).innerHTML)){
                if (/X/.test($("#" + j + '' + i).html())){
                    xcount2++;
                }
            }
            if (xcount > 2 || xcount2 > 2){
                xwin = true;
                i = 4;  // exit loop
            }
        }

        // Search diagonals
        let xcount = 0;
        let xcount2 = 0;
        for (let i = 1; i < 4; i++){
//             if (/X/.test(document.getElementById(i+''+i).innerHTML)){
            if (/X/.test($("#" + i + '' + i).html())){
                xcount++;
            }
            if (/X/.test($("#" + i+''+ (4 - i)).html())){
                xcount2++;
            }
        }
        if (xcount > 2 || xcount2 > 2){
            xwin = true;
        }

        if (xwin == true){
//             document.getElementById('msgs').innerHTML = 'GAME OVER! X wins!';
            $("#msgs").html("GAME OVER! X wins!");
            endgame();
        }
        else {
            // If center cell is not occupied then place O there
//             var o = document.createElement('h1');
//             var o = $("<h1>O</h1>");
//             $('h1:contains("O")').css('color', 'var(--bs-red)');
//             o.innerHTML = 'O';
//             o.firstChild.style.color = 'var(--bs-red)';
//             console.log($o.html());

//             cell = document.getElementById('22');

            if (!$("#22").html()){
                $("#22").append("<h1>O</h1>");
                $('h1:contains("O")').css('color', 'var(--bs-red)');
            }
            else{
                // Otherwise analyse where to put O
                // Algorithm for calculating weights is not perfect, and left this way deliberatly to make game winnable (therefore interesting)
                var owin = false;
                var freespots = 0;
                var matrix = new Array(3);
                // Initialize matrix for AI
                for (let i = 0; i < matrix.length; i++){
                    matrix[i] = new Array(3);
                }
                // Fill matrix with -1
                for (let i = 0; i < 3; i++){
                    for (let j = 0; j < 3; j++){
                        matrix[i][j] = -1;
                    }
                }

                // Calculate matrix
                let ocount = 0;
                for (let i = 0; i < 3; i++){
                    for (let j = 0; j < 3; j++){
//                         cell = document.getElementById((i+1) + ''+ (j+1));

                        // If current cell empty, check other in row and in column
//                         if (cell.innerHTML == ''){
                        if (!$("#" + (i + 1) + '' + (j + 1)).html()){
                            matrix[i][j] = 0; // Change weight to 0
                            freespots++; // Game will end when there are no more empty spots left
                            xcount = 0;
                            ocount = 0;
                            // Check column
                            for (let k = 1; k < 4; k++){
                                // Only other skipping current
                                if (k - 1 != i){
//                                     let cell2 = document.getElementById(k + ''+ (j+1));
//                                     if (/X/.test(cell2.innerHTML)){
                                    if (/X/.test($("#" + k + "" + (j + 1)).html())){
                                        xcount++;
                                    }
//                                     else if (/O/.test(cell2.innerHTML)){
                                    else if (/O/.test($("#" + k + "" + (j + 1)).html())){
                                        ocount++;
                                    }
                                }
                            }
                            // Add weight if there are two X already and AI can prevent win of X.
                            // It should has more weight than cell in intersection of X and O
                            if (xcount == 2){
                                xcount++;
                                xcount++;
                            }
                            // Add more weight if there are two O already and AI can win this round instead of preventing X from winning
                            if (ocount == 2){
                                ocount++;
                                ocount++;
                                ocount++;
                            }
                            // Write into matrix weight, calculated from quantity of X and O in a column
                            matrix[i][j] += Math.abs(xcount - ocount);

                            // Check row
                            xcount = 0;
                            ocount = 0;
                            for (let k = 1; k < 4; k++){
                                // Only other skipping current
                                if (k - 1 != j){
//                                     let cell2 = document.getElementById((i + 1) + ''+ k);
//                                     if (/X/.test(cell2.innerHTML)){
                                    if (/X/.test($("#" + (i + 1) + "" + k).html())){
                                        xcount++;
                                    }
//                                     else if (/O/.test(cell2.innerHTML)){
                                    else if (/O/.test($("#" + (i + 1) + "" + k).html())){
                                        ocount++;
                                    }
                                }
                            }
                            // Add weight if there are two X already and AI can prevent win of X
                            if (xcount == 2){
                                xcount++;
                                xcount++;
                            }
                            // Add more weight if there are two O already and AI can win this round
                            if (ocount == 2){
                                ocount++;
                                ocount++;
                                ocount++;
                            }
                            // Add weight calculated from quantity of X and O in a row
                            matrix[i][j] += Math.abs(xcount - ocount);

                            // Now check main diagonal
                            xcount = 0;
                            ocount = 0;
                            if (i == j){
                                for (let k = 1; k < 4; k++){
                                    // skip current cell
                                    if (k - 1 != i && k - 1 != j){
//                                         let cell2 = document.getElementById(k + '' + k);
//                                         if (/X/.test(cell2.innerHTML)){
                                        if (/X/.test($("#" + k + "" + k).html())){
                                            xcount++;
                                        }
//                                         else if (/O/.test(cell2.innerHTML)){
                                        else if (/O/.test($("#" + k + "" + k).html())){
                                            ocount++;
                                        }
                                    }
                                }
                                // Add weight if there are two X already and AI can prevent win of X
                                if (xcount == 2){
                                    xcount++;
                                    xcount++;
                                }
                                // Add more weight if there are two O already and AI can win this round
                                if (ocount == 2){
                                    ocount++;
                                    ocount++;
                                    ocount++;
                                }
                                matrix[i][j] += Math.abs(xcount - ocount);
                            }

                            // Check for secondary diagonal
                            xcount = 0;
                            ocount = 0;
// TODO разобраться с местной магией
                            if (Math.abs(i - j) == 2){
                                for (let k = 0; k < 3; k++){
                                    if (k != i && 2 - k != j){
//                                         let cell2 = document.getElementById((k + 1) + '' + (3 - k));
//                                         if (/X/.test(cell2.innerHTML)){
                                        if (/X/.test($("#" + (k + 1) + "" + (3 - k)).html())){
                                            xcount++;
                                        }
//                                         else if (/O/.test(cell2.innerHTML)){
                                        else if (/O/.test($("#" + (k + 1) + "" + (3 - k)).html())){
                                            ocount++;
                                        }
                                    }
                                }
                                // Add weight if there are two X already and AI can prevent win of X
                                if (xcount == 2){
                                    xcount++;
                                    xcount++;
                                }
                                // Add more weight if there are two O already and AI can win this round
                                if (ocount == 2){
                                    ocount++;
                                    ocount++;
                                    ocount++;
                                }
                                matrix[i][j] += Math.abs(xcount - ocount);
                            }
                        }
                    }
                }

            // After calculating matrix decide which cell to place O: find cell with max weight
            // Store all maximums to choose randomly - it weakens AI, but makes game more unpredictable
            // Actually if AI place 1st O in a corner it leads to draw: X could not win. Thats makes game very boring.
                var max = 0; // Should not set to -1, because there are -1 in matrix
                let k = []; // array to store row index
                let l = []; // array to store column index
                let m = -1; // var to store index for arrays (and counter of maximums)
                for (let i = 0; i < 3; i++){
                    for (let j = 0; j < 3; j++){
                        if (max < matrix[i][j]){
                            max = matrix[i][j];
                            m = 0;
                            k[m] = i;
                            l[m] = j;
                        }
                        else if (max == matrix[i][j]){
                            m++;
                            k[m] = i;
                            l[m] = j;
                        }
                    }
                }

                // Write O to random cell with maximum weight - It's needed on early rounds of game where is uncertanty
                if (m > 0){
                    let p = Math.floor(Math.random() * (m + 1));
//                     document.getElementById((k[p] + 1) + '' + (l[p]+1)).appendChild(o);
                    $("#" + (k[p] + 1) + "" + (l[p]+1)).html("<h1>O</h1>");
                }
                else if (m == 0)// If only one maximum, thus place O in that cell
                {
//                     document.getElementById((k[0] + 1) + '' + (l[0]+1)).appendChild(o);
                    $("#" + (k[0] + 1) + "" + (l[0]+1)).html("<h1>O</h1>");
                }
                // Color computer's Os
                $('h1:contains("O")').css('color', 'var(--bs-red)');

                // Check if O wins
                var owin = false;
                // search rows and rows simulteniously
                for (let i = 1; i < 4; i++){
                    let ocount = 0;
                    let ocount2 = 0;
                    for (let j = 1; j < 4; j++){
//                         if  (/O/.test(document.getElementById(i+''+j).innerHTML)){
                        if (/O/.test($("#" + i + "" + j).html())){
                            ocount++;
                        }
//                         if (/O/.test(document.getElementById(j+''+i).innerHTML)){
                        if (/O/.test($("#" + j + "" + i).html())){
                            ocount2++;
                        }
                    }
                    if (ocount > 2 || ocount2 > 2){
                        owin = true;
                        i = 4;  // exit loop
                    }
                }

                // Search diagonals
                ocount = 0;
                let ocount2 = 0;
                for (let i = 1; i < 4; i++){
//                     if (/O/.test(document.getElementById(i+''+i).innerHTML)){
                    if (/O/.test($("#" + i + "" + i).html())){
                        ocount++;
                    }
//                     if (/O/.test(document.getElementById(i+''+(4-i)).innerHTML)){
                    if (/O/.test($("#" + i + "" + (4 - i)).html())){
                        ocount2++;
                    }
                }
                if (ocount > 2 || ocount2 > 2){
                    owin = true;
                }
                if (owin == true){
//                     document.getElementById('msgs').innerHTML = 'GAME OVER! O wins!';
                    $("#msgs").html("GAME OVER! O wins!");
                    // Call funcion to fill left cell
                    endgame();
                }

                // When there are no more empty cell inform user
                if (freespots == 0 && !owin && !xwin){
//                     document.getElementById('msgs').innerHTML = "GAME OVER! IT'S A DRAW!";
                    $("#msgs").html("GAME OVER! IT'S A DRAW!");
                }
            }
        }
    }
    // If cell occupied then inform user to make other choice
    else {
//         cell.style.backgroundColor = 'var(--bs-warning)';
        $('#' + id).css('backgroundColor', 'var(--bs-warning)');
//         document.getElementById('msgs').innerHTML = 'Cell is occupied, choose another';
        $("#msgs").html("Cell is occupied, choose another");
//         setTimeout(function () {cell.style.backgroundColor = ''; document.getElementById('msgs').innerHTML = '' }, 1400);
        setTimeout(function () {$('#' + id).css('backgroundColor', ''); $("#msgs").html("") }, 1400);
    }
}

// Fill any empty cell left with dash
function endgame(){
    $( ".gamecell" ).each(function(){
        if (!$( this ).html()){
            $( this ).html("<h1>-</h1>");
        };
    })
}
