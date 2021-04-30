function start(){
     
    var score = 0;

     //Object Area
     $("#start").hide(); 
     $("#gameplay").append("<div class='score' id='score'>" + score + "</div>");
     $("#gameplay").append("<div class='missile' id='missile'></div>");
     $("#gameplay").append("<div class='player' id='player'></div>");
     $("#gameplay").append("<div class='obstacle' id='obstacle'></div>");
     $("#gameplay").append("<div class='scientist' id='scientist'></div>");
     $("#gameplay").append("<div class='coin' id='coin'></div>");

     //GameLoop Methods Config
     var game = {};
     var objectSpeed = 5;

     game.timer = setInterval(gameLoop, Math.floor(Math.random() * 30) + 15);

     function gameLoop(){
          scrollBackground();
          targetPlayerAndShoot();
          electricBarrier();
          // generateCoins();
          colliders();
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
          x:$("#gameplay").innerWidth() * .10, 
          y:$("#gameplay").innerHeight() / 2,
          
          update:function(){
               translateX = this.x-this.w/2;
               translateY = this.y-this.h/2 >= 300 ? 300 : this.y-this.h/2;
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
          $(".backgroundGame").css("background-position", esquerda -1);
     }

     function targetPlayerAndShoot(){
          posX = parseInt($(".missile").css("left"));
          $(".missile").css("left", posX - objectSpeed);
          
          if(posX <= -300){
               $(".missile").css("left",1100);
               $(".missile").css("top",  ($('.player').offset().top + 15) / 2);
          }
     }

     function electricBarrier(){
          posX = parseInt($(".obstacle").css("left"));
          $(".obstacle").css("left", posX - objectSpeed);
          if(posX <= -250){
               var posY = parseInt(Math.random() * 30);
               $(".obstacle").css("left",1050);
          }
     }

     // function generateCoins()
     // {
     //      posX = parseInt($(".coin").css("left"));
     //      $(".coin").css("left", posX - 5);
          
     //      if(posX <= -50){
     //           var posY = parseInt(Math.random() * 300);
     //           $(".coin").css("left",1100);
     //           $(".coin").css("top",50);

     //      }
     // }


     function colliders(){
          var colPlayerMissile = ($(".player")).collision($(".missile"));
          // var colPlayerObstacle = ($(".player")).collision($(".obstacle"));
          // var colPlayerScientist = ($(".player")).collision($(".scientist"));
          // var colisao6 = ($(".amigo")).collision($(".npc"));

          //Collision/Effect PlayerMissile Area
          if(colPlayerMissile.length>0){
               missileX = parseInt($(".missile").css("left"));
               missileY = parseInt($(".missile").css("top"));
               missileExplosion(missileX, missileY);

               playerX = parseInt($(".player").css("left"));
               playerY = parseInt($(".player").css("top"));
               explosaoPlayer(playerX, playerY);

               executaExplosao();

               score-=5;
               document.getElementById("score").innerHTML = String(score);

               posicaoY = parseInt(Math.random()*300);
               $(".missile").css("left", 1150);
               $(".missile").css("top", posicaoY);
          }

          
          function missileExplosion(missileX, missileY){
               $(".backgroundGame").append("<div class='missileExplosion'></div>");
               var missile = $(".missileExplosion");
               missile.css("top",missileY);
               missile.css("left",missileX+220);
               var exitMissionExplosionTimer = window.setInterval(exitMissionExplosion,1000);

               function exitMissionExplosion(){
                    missile.remove();
                    window.clearInterval(exitMissionExplosionTimer);
                    exitMissionExplosionTimer = null;
               }
          }
          //Collision/Effect PlayerMissile Area End
          //Collision PlayerObstacle Area
          if(colPlayerObstacle.length>0){
               npcX = parseInt($(".npc").css("left"));
               npcY = parseInt($(".npc").css("top"));

               playerX = parseInt($(".player").css("left"));
               playerY = parseInt($(".player").css("top"));
               explosaoPlayer(playerX, playerY);

               executaExplosao();

               score-=5;
               document.getElementById("score").innerHTML = String(score);

               $(".npc").css("left", 800);
               $(".npc").css("top", 130);

               $(".player").css("left", 100);
               $(".player").css("top", -50);
          }
          //Collision PlayerObstacle Area End
          // //Collision PlayerMissile Area End
          // if(colPlayerScientist.length>0){
          //      $(".amigo").hide();
          //      var tempoRecriar = window.setInterval(recriar, 4000);
          //      score+=5;
          //      document.getElementById("score").innerHTML = String(score);
          // }
          // function recriar(){
          //      $(".amigo").show();
          //      window.clearInterval(tempoRecriar);
          //      tempoRecriar = null; 
          // }
          // if(colisao6.length>0){
          //      amigoX = parseInt($(".amigo").css("left"));
          //      amigoY = parseInt($(".amigo").css("top"));
          //      explosaoAmigo(amigoX, amigoY);
          //      $(".amigo").hide();
          //      score-=1;
          //      document.getElementById("score").innerHTML = String(score);
          //      var tempoRecriar = window.setInterval(recriar, 6000);
          // }
     }


   function explosaoPlayer(playerX, playerY){
        $(".backgroundGame").append("<div class='explosaoPlayer'></div>");
        $(".explosaoPlayer").css("background-image","url(image/explosao-player.png)");
        var div2 = $(".explosaoPlayer");
        div2.css("top",playerY+300);
        div2.css("left",playerX+450);
        div2.animate({width:200, opacity:0}, "slow");
        var tempoExplosaoPlayer = window.setInterval(removeExplosaoPlayer, 1000);

        function removeExplosaoPlayer(){
             div2.remove();
             window.clearInterval(tempoExplosaoPlayer);
             tempoExplosaoPlayer = null;
        }
   }
   function explosaoNpc(npcX, npcY){
        $(".backgroundGame").append("<div class='explosaoNpc'></div>");
        $(".explosaoNpc").css("background-image", "url(image/explosao.png");
        var div3 = $(".explosaoNpc");
        div3.css("top", npcY+400);
        div3.css("left", npcX+500);
        div3.animate({width:200, opacity:0}, "slow");
        var tempoExplosaoNpc = window.setInterval(removeExplosaoNpc, 1000);

        function removeExplosaoNpc(){
             div3.remove();
             window.clearInterval(tempoExplosaoNpc);
             tempoExplosaoNpc = null;
        }
   }
   function explosaoAmigo(amigoX, amigoY){
        $(".backgroundGame").append("<div class='explosaoAmigo'></div>");
        $(".explosaoAmigo").css("background-image", "url(image/sangue.png");
        var div4 = $(".explosaoAmigo");
        div4.css("top", amigoY+500);
        div4.css("left", amigoX+320);
        div4.animate({width:300, opacity:0}, "slow");
        var tempoExplosaoAmigo = window.setInterval(removeExplosaoAmigo, 1000);
        function removeExplosaoAmigo(){
             div4.remove();
             window.clearInterval(tempoExplosaoAmigo);
             tempoExplosaoAmigo = null;
        }
   }
   function gameover(){
        if(score < 0){
          window.clearInterval(game.timer);
          game.timer = null;
          score = 0;
          $(".player").remove();
          $(".npc").remove();
          $(".missile").remove();
          $(".amigo").remove();
          $(".score").remove()
          $("#inicio").show();
          pauseTrilha();
        }
   }
    function vitoria(){
        if(score>=10){
             window.clearInterval(game.timer);
             game.timer = null;
             $(".obstacle").remove();
             $(".missile").remove();
             $(".scientist").remove();
             $(".backgroundGame").append("<div class='vitoria'><h1>Você ganhou!!</h1></div>");
             pauseTrilha();
          }
    }

    //Audio Area
    var trilha = document.getElementById("background-music");
    var audioExplosao = document.getElementById("audioExplosao");

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
       
    //Utils
     function getCurrentPlayerY(el) {
          var rect = $('.player').getBoundingClientRect(),
          scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
          scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
     }
}