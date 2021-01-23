class Squares {

    constructor(widthCells, heightCells, numColors) {
        this._ = (id) => {
          return document.getElementById(id);
        }
        this.squareWidth = this._("myCanvas").width / widthCells;
        this.squareHeight = this._("myCanvas").height / heightCells;
        this.colorsArray = [];
        this.colorMapArray = [];
        this.widthCells = widthCells;
        this.heightCells = heightCells;
        this.numColors = numColors;
        this.printSquares = this.printSquares.bind(this);
        this.pushRandomColors = this.pushRandomColors.bind(this);
        this.getRandomColor = this.getRandomColor.bind(this);
        this.pickRandomColor = this.pickRandomColor.bind(this);
    }

    printSquares() {

        let c = this._("myCanvas");
        let ctx = c.getContext("2d");
        this.pushRandomColors();
        for (let i = 0; i < this.widthCells; i++) {
            this.colorMapArray.push([]);
            for (let j = 0; j < this.heightCells; j++) {
                ctx.strokeStyle = "#FFFFFF";
                ctx.strokeRect(i * this.squareWidth, j * this.squareHeight, this.squareWidth, this.squareHeight);
                ctx.fillStyle = this.pickRandomColor();
                ctx.fillRect(i * this.squareWidth, j * this.squareHeight, this.squareWidth, this.squareHeight);
            }
        }

        this.getMaxConnected();

    }

    getMaxConnected(){

        let max = 0;
        let colorIndex = 0;

        for(var i = 0; i < this.numColors; i++){
          let matrix = this.colorMapArray;
          let largestOfColor = this.largestGroup(matrix, i);

          if(largestOfColor > max){
            max = largestOfColor;
            colorIndex = i;            
          }

        }

        this._("maxCells").innerHTML = `The biggest area contains : ${max} cells with color below : `;
        this._("maxCellsColor").style.backgroundColor = this.colorsArray[colorIndex];
    }


    pushRandomColors() {
        for (var i = 0; i < this.numColors; i++) {
            this.colorsArray.push(this.getRandomColor());
        }
    }

    getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    pickRandomColor() {
        let randomNumber = Math.floor(Math.random() * (this.numColors));
        this.colorMapArray[this.colorMapArray.length - 1].push(randomNumber);
        return this.colorsArray[randomNumber];
    }

    largestGroup(matrix, colorValue) {
        let counts = [0];
        function countConnected(i, j) {
            if (matrix[i][j] == colorValue) {
                matrix[i][j] = null;
                return neighborsOf(i, j).reduce(function(sum, coord) {
                    return sum + countConnected(coord[0], coord[1]);
                }, 1);
            }
            return 0;
        }

        function neighborsOf(i, j) {
            return [
                [i - 1, j],
                [i + 1, j], 
                [i, j - 1],
                [i, j + 1], 
            ].filter(function(coord) {
                return matrix[coord[0]] && (matrix[coord[0]][coord[1]] == colorValue);
            });
        }

        matrix = matrix.slice().map(function(row) {
            return row.slice();
        });

        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] == colorValue) {
                    counts.push(countConnected(i, j));
                }
            }
        }

        return Math.max.apply(null, counts);
    }

}