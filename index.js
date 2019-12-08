(function() {

  glUtils.SL.init({ callback: function() { main(); } });

  function main() {
    var canvas = document.getElementById("glcanvas");
    var gl = glUtils.checkWebGL(canvas);
  
    // Inisialisasi shaders dan program
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v2.vertex);
    var fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v2.fragment);
    
    // letter shaders
    let vertexShaderLet = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex);
    let fragmentShaderLet = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
        
    var program = glUtils.createProgram(gl, vertexShader, fragmentShader);
    // letter program
    let program2 = glUtils.createProgram(gl, vertexShaderLet, fragmentShaderLet);

    gl.useProgram(program);

    // var for letter
    let currentPressedKeys = {};
    let pos = [0,0,0];

    let center = [0,0,0];
    let rotDir = 1;

    let cubeBoundaryPoint = [0, 15, 18, 21, 33, 45];

    // end for letter

    // let triangleVertices = [
    //   -0.2, -0.3,-0.0,   
    //   0.0, +0.5,0.0,   
    //   +0.2, -0.3,0.0,  

    //   -0.2, -0.3,0.0,   
    //   -0.3, -0.7,0.0, 
    //   -0.2, -0.7,0.0,  

    //   -0.2, -0.3,0.0,  
    //   -0.2, -0.7,0.0,   
    //   -0.1, -0.3,0.0,   

    //   +0.2, -0.3,0.0, 
    //   +0.3, -0.7,0.0,  
    //   +0.2, -0.7,0.0, 

    //   +0.2, -0.3,0.0,   
    //   +0.2, -0.7,0.0,  
    //   +0.1, -0.3,0.0, 
    // ];

    var triangleVertices = [
      //x,y
      0.0,0.25,0.0,
      0.0,-0.25,0.0,
      0.05,0.35,0.0,
      0.05,-0.25,0.0,
      0.05,0.0,0.0,
      0.05,0.1,0.0,
      0.125,0.0,0.0,
      0.175,0.1,0.0,
      0.125,0.35,0.0,
      0.175,0.35,0.0
    ];

    matrixScaling(triangleVertices, 0.7);

    function BuildLetter(){


      gl.useProgram(program2);
      //create buffer
      letterBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER ,letterBuffer);

      gl.bufferData(gl.ARRAY_BUFFER,  new Float32Array(triangleVertices), gl.STATIC_DRAW);
      var aPosition = gl.getAttribLocation(program2, 'vPosition');
      // var vColor = gl.getAttribLocation(program2, 'vColor');

      gl.vertexAttribPointer(
        aPosition,  // variabel yang memegang posisi attribute di shader
        3,          // jumlah elemen per attribute
        gl.FLOAT,   // tipe data atribut
        gl.FALSE,
        0,
        0                                   // offset dari posisi elemen di array
      );

      // gl.vertexAttribPointer(vColor, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
      
      gl.enableVertexAttribArray(aPosition);
      // gl.enableVertexAttribArray(vColor);

      gl.useProgram(program);

    }

    var cubeVertices = [
      // x, y, z            u, v         normal

      // -0.5,  0.5,  0.5,     0.0, 1.0,  0.0, 0.0, 1.0, // depan, merah, BAD BDC
      // -0.5, -0.5,  0.5,     0.0, 0.0,  0.0, 0.0, 1.0, 
      //  0.5, -0.5,  0.5,     1.0, 0.0,  0.0, 0.0, 1.0, 
      // -0.5,  0.5,  0.5,     0.0, 1.0,  0.0, 0.0, 1.0, 
      //  0.5, -0.5,  0.5,     1.0, 0.0,  0.0, 0.0, 1.0, 
      //  0.5,  0.5,  0.5,     1.0, 1.0,  0.0, 0.0, 1.0, 

      0.5,  0.5,  0.5,     0.33, 0.5,  1.0, 0.0, 0.0, // kanan, hijau, CDH CHG
      0.5, -0.5,  0.5,     0.33, 0.0,  1.0, 0.0, 0.0,
      0.5, -0.5, -0.5,     0.67, 0.0,  1.0, 0.0, 0.0,
      0.5,  0.5,  0.5,     0.33, 0.5,  1.0, 0.0, 0.0,
      0.5, -0.5, -0.5,     0.67, 0.0,  1.0, 0.0, 0.0,
      0.5,  0.5, -0.5,     0.67, 0.5,  1.0, 0.0, 0.0,

      0.5, -0.5,  0.5,     0.0, 1.0,  0.0, -1.0, 0.0, // bawah, biru, DAE DEH
     -0.5, -0.5,  0.5,     0.0, 0.5,  0.0, -1.0, 0.0,
     -0.5, -0.5, -0.5,     0.33, 0.5,  0.0, -1.0, 0.0,
      0.5, -0.5,  0.5,     0.0, 1.0,  0.0, -1.0, 0.0,
     -0.5, -0.5, -0.5,     0.33, 0.5,  0.0, -1.0, 0.0,
      0.5, -0.5, -0.5,     0.33, 1.0,  0.0, -1.0, 0.0,

     -0.5, -0.5, -0.5,     0.33, 1.0,  0.0, 0.0, -1.0, // belakang, kuning, EFG EGH
     -0.5,  0.5, -0.5,     0.33, 0.5,  0.0, 0.0, -1.0,
      0.5,  0.5, -0.5,     0.67, 0.5,  0.0, 0.0, -1.0,
     -0.5, -0.5, -0.5,     0.33, 1.0,  0.0, 0.0, -1.0,
      0.5,  0.5, -0.5,     0.67, 0.5,  0.0, 0.0, -1.0,
      0.5, -0.5, -0.5,     0.67, 1.0,  0.0, 0.0, -1.0,

     -0.5,  0.5, -0.5,     0.67, 1.0,  -1.0, 0.0, 0.0, // kiri, cyan, FEA FAB
     -0.5, -0.5, -0.5,     0.67, 0.5,  -1.0, 0.0, 0.0,
     -0.5, -0.5,  0.5,     1.0, 0.5,  -1.0, 0.0, 0.0,
     -0.5,  0.5, -0.5,     0.67, 1.0,  -1.0, 0.0, 0.0,
     -0.5, -0.5,  0.5,     1.0, 0.5,  -1.0, 0.0, 0.0,
     -0.5,  0.5,  0.5,     1.0, 1.0,  -1.0, 0.0, 0.0,

      0.5,  0.5, -0.5,     0.0, 0.5,  0.0, 1.0, 0.0, // atas, magenta, GFB GBC
     -0.5,  0.5, -0.5,     0.0, 0.0,  0.0, 1.0, 0.0,
     -0.5,  0.5,  0.5,     0.33, 0.0,  0.0, 1.0, 0.0,
      0.5,  0.5, -0.5,     0.0, 0.5,  0.0, 1.0, 0.0,
     -0.5,  0.5,  0.5,     0.33, 0.0,  0.0, 1.0, 0.0,
      0.5,  0.5,  0.5,     0.33, 0.5,  0.0, 1.0, 0.0
    ];

    let vPosition;
    let vTexCoord;
    let vNormal;

    function BuildCube(){

      // use program
      gl.useProgram(program);

      var cubeVBO = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, cubeVBO);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);

      vPosition = gl.getAttribLocation(program, 'vPosition');
      vTexCoord = gl.getAttribLocation(program, 'vTexCoord');
      vNormal = gl.getAttribLocation(program, 'vNormal');
      gl.vertexAttribPointer(
        vPosition,  // variabel yang memegang posisi attribute di shader
        3,          // jumlah elemen per attribute
        gl.FLOAT,   // tipe data atribut
        gl.FALSE,
        8 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap verteks 
        0                                   // offset dari posisi elemen di array
      );
      gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, gl.FALSE, 
        8 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
      gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, gl.FALSE, 
        8 * Float32Array.BYTES_PER_ELEMENT, 5 * Float32Array.BYTES_PER_ELEMENT);

      gl.enableVertexAttribArray(vPosition);
      gl.enableVertexAttribArray(vTexCoord);
      gl.enableVertexAttribArray(vNormal);
    }

    var theta = [0.0, 0.0, 0.0];
    var axis = 0;
    var xAxis = 0;
    var yAxis = 1;
    var zAxis = 2;

    // Uniform untuk definisi cahaya
    var lightColorLoc = gl.getUniformLocation(program, 'lightColor');
    var lightPositionLoc = gl.getUniformLocation(program, 'lightPosition');
    var ambientColorLoc = gl.getUniformLocation(program, 'ambientColor');
    var lightColor = [0.5, 0.5, 0.5];
    var ambientColor = glMatrix.vec3.fromValues(0.17, 0.41, 0.28);
    gl.uniform3fv(lightColorLoc, lightColor);
    gl.uniform3fv(ambientColorLoc, ambientColor);

    var nmLoc = gl.getUniformLocation(program, 'normalMatrix');


    var lastX, lastY, dragging;
    function onMouseDown(event) {
      var x = event.clientX;
      var y = event.clientY;
      var rect = event.target.getBoundingClientRect();
      if (rect.left <= x &&
          rect.right > x &&
          rect.top <= y &&
          rect.bottom > y) {
            lastX = x;
            lastY = y;
            dragging = true;
      }
    }
    function onMouseUp(event) {
      dragging = false;
    }
    function onMouseMove(event) {
      var x = event.clientX;
      var y = event.clientY;
      if (dragging) {
        var factor = 10 / canvas.height;
        var dx = factor * (x - lastX);
        var dy = factor * (y - lastY);
        theta[yAxis] += dx;
        theta[xAxis] += dy;
      }
      lastX = x;
      lastY = y;
    }
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    // Definisi view, model, dan projection
    var vmLoc = gl.getUniformLocation(program, 'view');
    var pmLoc = gl.getUniformLocation(program, 'projection');
    var mmLoc = gl.getUniformLocation(program, 'model');
    var vm = glMatrix.mat4.create();
    var pm = glMatrix.mat4.create();

    glMatrix.mat4.lookAt(vm,
      glMatrix.vec3.fromValues(0.0, 0.0, 0.0),    // posisi kamera
      glMatrix.vec3.fromValues(0.0, 0.0, -2.0),  // titik yang dilihat; pusat kubus akan kita pindah ke z=-2
      glMatrix.vec3.fromValues(0.0, 1.0, 0.0)   // arah atas dari kamera
    );

    var fovy = glMatrix.glMatrix.toRadian(90.0);
    var aspect = canvas.width / canvas.height;
    var near = 0.5;
    var far = 10.0;
    glMatrix.mat4.perspective(
      pm,
      fovy,
      aspect,
      near,
      far
    );

    gl.uniformMatrix4fv(vmLoc, false, vm);
    gl.uniformMatrix4fv(pmLoc, false, pm);

    // projection view for letter
      
    let vmLoc2 = gl.getUniformLocation(program2, 'view');
    let pmLoc2 = gl.getUniformLocation(program2, 'projection');

    // send data tu shaders via uniform
    gl.uniformMatrix4fv(vmLoc2, false, vm);
    gl.uniformMatrix4fv(pmLoc2, false, pm);

    BuildController();
    var lightPosition = [triangleVertices[15], triangleVertices[16], triangleVertices[17]];
    function render() {

      // Build Box
      BuildCube();
      
      // theta[axis] += glMatrix.glMatrix.toRadian(0.5);  // dalam derajat
      var mm = glMatrix.mat4.create();
      glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -2.0]);
      // glMatrix.mat4.rotateZ(mm, mm, theta[zAxis]);

      var mvpLoc = gl.getUniformLocation(program, 'MVPMatrix');
      var mvp = glMatrix.mat4.create();
      glMatrix.mat4.multiply(mvp,vm,mm);
      glMatrix.mat4.multiply(mvp,pm,mvp);

      glMatrix.mat4.rotateY(mvp, mvp, theta[yAxis]);
      glMatrix.mat4.rotateX(mvp, mvp, theta[xAxis]);

      // glMatrix.mat4.rotateY(mm, mm, theta[yAxis]);
      // glMatrix.mat4.rotateX(mm, mm, theta[xAxis]);

      gl.uniformMatrix4fv(mvpLoc, false, mvp);

      glMatrix.mat4.translate(mm, mm, [0.0, 0.0, 2.0]);
      gl.uniformMatrix4fv(mmLoc, false, mm);
      
      // console.log(lightPosition);
      gl.uniform3fv(lightPositionLoc, lightPosition);

      // Perhitungan modelMatrix untuk vektor normal
      var nm = glMatrix.mat3.create();
      glMatrix.mat3.normalFromMat4(nm, mm);
      gl.uniformMatrix3fv(nmLoc, false, nm);

      // Bersihkan buffernya canvas
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
      gl.enableVertexAttribArray(vPosition);
      gl.enableVertexAttribArray(vTexCoord);
      gl.enableVertexAttribArray(vNormal);
      gl.drawArrays(gl.TRIANGLES, 0, 30);

      // build letter
      handleKeys();
      update();

      BuildLetter();
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 10);

      requestAnimationFrame(render); 
    }

    // Bersihkan layar jadi hitam
    gl.clearColor(0.333, 0.98, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Uniform untuk tekstur
    // var sampler0Loc = gl.getUniformLocation(program, 'sampler0');
    // gl.uniform1i(sampler0Loc, 0);
    // Inisialisasi tekstur
    var texture = gl.createTexture();
    if (!texture) {
      reject(new Error('Gagal membuat objek tekstur'));
    }
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Sementara warnai tekstur dengan sebuah 1x1 piksel biru
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
    initTexture(function () {
      render();
    });

    // Membuat mekanisme pembacaan gambar jadi tekstur
    function initTexture(callback, args) {
      var imageSource = 'images/cute.png';
      var promise = new Promise(function(resolve, reject) {
        var image = new Image();
        if (!image) {
          reject(new Error('Gagal membuat objek gambar'));
        }
        image.onload = function() {
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          resolve('Sukses');
        }
        image.src = imageSource;
      });
      promise.then(function() {
        if (callback) {
          callback(args);
        }
      }, function (error) {
        console.log('Galat pemuatan gambar', error);
      });
    }

    function handleKeys() {
      if (currentPressedKeys[37]) {
          // Kiri
          pos[0] -= 0.05;
          console.log("kiri");
      }

      if (currentPressedKeys[39]) {
          // Kanan
          pos[0] += 0.05;
          console.log("kanan");
      }

      if (currentPressedKeys[38]) {
          // Atas
          pos[1] += 0.05;
          console.log("atas");
      }

      if (currentPressedKeys[40]) {
          // Bawah
          pos[1] -= 0.05;
          console.log("bawah");
      }

      if (currentPressedKeys[87]) {
      
        pos[2] += 0.05;
        console.log("w");
      }

      if (currentPressedKeys[83]) {
        pos[2] -= 0.05;
        console.log("s");
      }
    }

    function BuildController(){
      function handleKeyDown(event) {
        currentPressedKeys[event.keyCode] = true
      }

      function handleKeyUp(event) {
          currentPressedKeys[event.keyCode] = false
      }

      document.onkeydown = handleKeyDown
      document.onkeyup = handleKeyUp

    }

    function OnCollision() {

      for (var i = 0; i < pos.length; i++) {
        for (var k = 0; k < cubeBoundaryPoint.length; k++) {
          if (triangleVertices[cubeBoundaryPoint[k] + i] >= 0.4 || triangleVertices[cubeBoundaryPoint[k] + i] <= -0.4) {
            pos[i] *= -1;
            rotDir *= -1;
            break;
          }
        }
      }
    }

    function update(){
      // movement
      triangleVertices = matrixTranslating(triangleVertices , pos[0] * 0.01, pos[1] * 0.01, pos[2] * 0.01);
      lightPosition = matrixTranslating(lightPosition, pos[0] * 0.01, pos[1] * 0.01, pos[2] * -0.01);
      center[0] += (pos[0] * 0.01);
      center[1] += (pos[1] * 0.01);
      center[2] += (pos[2] * 0.01);
      triangleVertices = matrixRotating(triangleVertices, rotDir * 1.5, center[0], center[2])
      
      OnCollision();
    }


  }

})();
