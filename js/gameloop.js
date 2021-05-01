function start(){
     
     //GameLoop Methods Config
     var game = {};
     var gameSpeed = 5;
     var scrollSpeed = 1;
     var score = 0;
     var isGameOver = false;
 
     //Object Area
     $("#start").hide(); 
     $("#gameplay").append("<div class='score' id='score'>" + score + " M</div>");
     $("#gameplay").append("<div class='missile' id='missile'></div>");
     $("#gameplay").append("<div class='player' id='player'></div>");
     $("#gameplay").append("<div class='obstacle' id='obstacle'></div>");

     game.timer = setInterval(gameLoop, Math.floor(Math.random() * 30) + 15);

     function gameLoop(){
          scrollBackground();
          targetPlayerAndShoot();
          electricBarrier();
          collider();
          gameover(); 
          vitoria();
     }
     //End GameLoop Methods Config

     //Movement Area (Using Lerp to Move through Y Axis)
     var mouseX=$("#gameplay").innerWidth()/2;
     var mouseY=$("#gameplay").innerHeight()/2;
     
     var player = {
          el:$('#player'),
          w:100, h:115,
          x:$("#gameplay").innerWidth() * .25, 
          y:$("#gameplay").innerHeight() / 2,
          
          update:function(){
               translateX = this.x-this.w/2;
               translateY = this.y-this.h/2 >= 480 ? 480 : this.y-this.h/2;
               this.el.css({
                    'transform':'translate('+translateX+'px, '+translateY+'px)'
               });
          }
     }

     $(window).mousemove(function(e){
          mouseX = e.clientX / 2;
          mouseY = e.clientY / 2;
     })

     function move(){
          // player.x = lerp(player.x, mouseX, 0.1);
          player.y = lerp(player.y, mouseY, 0.1);
          player.update() 
     }
     
     function lerp (start, end, amt){
          return (1-amt)*start+amt*end
     }

     setInterval (move,1000/60)
     //End Movement Area


     //In Game Objects Control
     function scrollBackground(){
          esquerda = parseInt($(".backgroundGame").css("background-position"));
          $(".backgroundGame").css("background-position", esquerda -scrollSpeed);
     }

     var playMissile = true;

     function targetPlayerAndShoot(){
          if (playMissile) {
               executaMissil();
               playMissile = false;
          }
          posX = parseInt($(".missile").css("left"));
          $(".missile").css("left", posX - gameSpeed);
          $(".missile").css("background-position", esquerda -1);
          
          if(posX <= -300){
               playMissile = true;
               $(".missile").css("left",1100);
               $(".missile").css("top",  ($('.player').offset().top + 15) / 2);
          }
     }

     function electricBarrier(){
          posX = parseInt($(".obstacle").css("left"));
          $(".obstacle").css("left", posX - gameSpeed);
          if(posX <= -250){
               var posY = parseInt(Math.random() * 30);
               $(".obstacle").css("left",1050);
          }
     }
 
 
    function collider(){
         var colPlayerMissile = ($(".player")).collision($(".missile"));
         var colPlayerObstacle = ($(".player")).collision($(".obstacle"));
 
         if(colPlayerMissile.length>0){
               inimigoX = parseInt($(".missile").css("left"));
               inimigoY = parseInt($(".missile").css("top"));
               explosionFX(inimigoX, inimigoY);
               executaExplosao();

               isGameOver = true;
               gameover();

               posicaoY = parseInt(Math.random()*300);
               $(".missile").css("left", 1150);
               $(".missile").css("top", posicaoY);
         }
         if(colPlayerObstacle.length>0){
              obstacleX = parseInt($(".obstacle").css("left"));
              obstacleY = parseInt($(".obstacle").css("top"));
              explosionRayFX(obstacleX, obstacleY);
              executaExplosao();

              isGameOver = true;
              gameover();

              $(".obstacle").css("left", 1150);
              $(".obstacle").css("top", 130);
 
          //     $(".player").css("left", 100);
          //     $(".player").css("top", -50);
         }

          if(colisao6.length>0){
               // se remover esse if o collisor para de funcionar BECAUSE REASONS!
          }
    }


    function explosionFX(inimigoX, inimigoY){
         $("#gameplay").append("<div class='explosion'></div>");
         var explosionDiv = $(".explosion");
         explosionDiv.css("top",inimigoY+120);
         explosionDiv.css("left",inimigoX+320);

         var timeExplosion = window.setInterval(removeExplosion,1000);
 
         function removeExplosion(){
          explosionDiv.remove();
              window.clearInterval(timeExplosion);
              timeExplosion = null;
         }
    }

    function explosionRayFX(inimigoX, inimigoY){
          $("#gameplay").append("<div class='explosion'></div>");
          var explosionDiv = $(".explosion");
          explosionDiv.css("top",inimigoY+290);
          explosionDiv.css("left",inimigoX+380);

          var timeExplosion = window.setInterval(removeExplosion,1000);

          function removeExplosion(){
          explosionDiv.remove();
               window.clearInterval(timeExplosion);
               timeExplosion = null;
          }
     }


  
     function countScore(){     
               if (score % 10 == 0){
                    scrollSpeed++;
                    gameSpeed++;
               }
               document.getElementById("score").innerHTML = String(score++) + " M";
     }

    setInterval(countScore, 1000);

     function gameover(){
          if(isGameOver){
               window.clearInterval(game.timer);
               game.timer = null;
               score = 0;
               $(".player").remove();
               $(".obstacle").remove();
               $(".missile").remove();
               $(".score").remove()
               $("#start").show();
               pauseTrilha();
          }
     }

     //Audio Area
     var trilha = document.getElementById("background-music");
     var audioExplosao = document.getElementById("audioExplosao3");
     var audioMissile = document.getElementById("audioMissile");
 
     //Music Area
     function executaTrilha(){
         trilha.play();
         trilha.volume = 0.2;
     }
     function pauseTrilha(){
         trilha.pause();
     }
     executaTrilha();
 
     //SFX Area
     function executaExplosao(){
         audioExplosao.play();
     }

     function executaMissil(){
          audioMissile.play();
      }
     
 }