function start(){
     
     var pontos = 0;

     $("#inicio").hide(); 
     $("#gameplay").append("<div class='pontos' id='pontos'>" + pontos + "</div>");
     $("#gameplay").append("<div class='inimigo'></div>");
     $("#gameplay").append("<div class='player'></div>");
     $("#gameplay").append("<div class='npc'></div>");
     $("#gameplay").append("<div class='amigo'></div>");

     var trilha = document.getElementById("trilha");
     var audioExplosao = document.getElementById("audioExplosao");
     function executaTrilha(){
          trilha.play();
          trilha.volume = 0.2;
     }
     function pauseTrilha(){
          trilha.pause();
     }
     function executaExplosao(){
          audioExplosao.play();
     }
     executaTrilha();
     
     var jogo = {};
     var velocidade = 3;
     var podeAtirar = true;
     var TECLA = {
         W:87,
         S:83,
         SPACE:32
     };
    
    jogo.pressionou = [];

    $(document).keydown(function(e){
         jogo.pressionou[e.which] = true;
    });
    $(document).keyup(function(e){
         jogo.pressionou[e.which] = false;
    });

    jogo.timer = setInterval(loop, 10);

   function moveFundo(){
       esquerda = parseInt($(".fundoGame").css("background-position"));
       $(".fundoGame").css("background-position", esquerda -1);
   }

   function moveJogador(){
        //Teclas pressionadas
        if(jogo.pressionou[TECLA.W]){
             var topo = parseInt($(".player").css("top"));
             $(".player").css("top", topo -10);
             if(topo<=-150){
                  $(".player").css("top", topo +10);
             }
        }
        if(jogo.pressionou[TECLA.S]){
             var topo = parseInt($(".player").css("top"));
             $(".player").css("top", topo +10);
             if(topo>=270){
                  $(".player").css("top", topo -10);
             }
        }
        if(jogo.pressionou[TECLA.SPACE]){
             disparo();
        }
   }

   function disparo(){
        if(podeAtirar==true){
          podeAtirar=false;
          topo = parseInt($(".player").css("top"));
          posicaoX = parseInt($(".player").css("left"));
          tiroX = posicaoX + 120;
          topoTiro = topo - 230;
          $(".fundoGame").append("<div class='disparo'></div>");
          $(".disparo").css("top", topoTiro);
          $(".disparo").css("left", tiroX);
          var tempoDisparo = window.setInterval(executaDisparo, 30);
        }
        function executaDisparo(){
          posicaoX = parseInt($(".disparo").css("left"));
          $(".disparo").css("left", posicaoX+15);
          if(posicaoX>910){
               window.clearInterval(tempoDisparo);
               tempoDisparo = null;
               $(".disparo").remove();
               podeAtirar = true;
          }
             
        }
   }

   function moveInimigo(){
        posicaoX = parseInt($(".inimigo").css("left"));
        $(".inimigo").css("left", posicaoX - velocidade);
        if(posicaoX <= 0){
            var posicaoY = parseInt(Math.random()*300);
            $(".inimigo").css("left",800);
            $(".inimigo").css("top",posicaoY);
        }
   }

   function moveNpc(){
        posicaoX = parseInt($(".npc").css("left"));
        $(".npc").css("left", posicaoX - (velocidade/2));
        if(posicaoX <= 0){
            $(".npc").css("left",800);
        }
   }

   function colisao(){
        var colisao1 = ($(".player")).collision($(".inimigo"));
        var colisao2 = ($(".player")).collision($(".npc"));
        var colisao3 = ($(".player")).collision($(".amigo"));
        var colisao4 = ($(".disparo")).collision($(".inimigo"));
        var colisao5 = ($(".disparo")).collision($(".npc"));
        var colisao6 = ($(".amigo")).collision($(".npc"));

        if(colisao1.length>0){
             inimigoX = parseInt($(".inimigo").css("left"));
             inimigoY = parseInt($(".inimigo").css("top"));
             explosao(inimigoX, inimigoY);

             playerX = parseInt($(".player").css("left"));
             playerY = parseInt($(".player").css("top"));
             explosaoPlayer(playerX, playerY);

             executaExplosao();

             pontos-=5;
             document.getElementById("pontos").innerHTML = String(pontos);

             posicaoY = parseInt(Math.random()*300);
             $(".inimigo").css("left", 700);
             $(".inimigo").css("top", posicaoY);

             $(".player").css("left", 100);
             $(".player").css("top", -50);
        }
        if(colisao2.length>0){
             npcX = parseInt($(".npc").css("left"));
             npcY = parseInt($(".npc").css("top"));

             playerX = parseInt($(".player").css("left"));
             playerY = parseInt($(".player").css("top"));
             explosaoPlayer(playerX, playerY);

             executaExplosao();

             pontos-=5;
             document.getElementById("pontos").innerHTML = String(pontos);

             $(".npc").css("left", 800);
             $(".npc").css("top", 130);

             $(".player").css("left", 100);
             $(".player").css("top", -50);
        }
        if(colisao3.length>0){
             $(".amigo").hide();
             var tempoRecriar = window.setInterval(recriar, 4000);
             pontos+=5;
             document.getElementById("pontos").innerHTML = String(pontos);
        }
        function recriar(){
            $(".amigo").show();
            window.clearInterval(tempoRecriar);
            tempoRecriar = null; 
        }
        if(colisao4.length>0){
             inimigoX = parseInt($(".inimigo").css("left"));
             inimigoY = parseInt($(".inimigo").css("top"));
             explosao(inimigoX, inimigoY);

             executaExplosao();

             posicaoY = parseInt(Math.random()*300);
             $(".inimigo").css("left", 700);
             $(".inimigo").css("top", posicaoY);
        }
        if(colisao5.length>0){
             npcX = parseInt($(".npc").css("left"));
             npcY = parseInt($(".npc").css("top"));
             explosaoNpc(npcX, npcY);

             executaExplosao();

             $(".npc").css("left", 800);
             $(".npc").css("top", 130);
        }
        if(colisao6.length>0){
             amigoX = parseInt($(".amigo").css("left"));
             amigoY = parseInt($(".amigo").css("top"));
             explosaoAmigo(amigoX, amigoY);
             $(".amigo").hide();
             pontos-=1;
             document.getElementById("pontos").innerHTML = String(pontos);
             var tempoRecriar = window.setInterval(recriar, 6000);
        }

   }
   function explosao(inimigoX, inimigoY){
        $(".fundoGame").append("<div class='explosao'></div>");
        $(".explosao").css("background-image", "url(image/explosao.png)");
        var div = $(".explosao");
        div.css("top",inimigoY+150);
        div.css("left",inimigoX+450);
        div.animate({with:200, opacity:0},"slow");
        var tempoExplosao = window.setInterval(removeExplosao,1000);

        function removeExplosao(){
             div.remove();
             window.clearInterval(tempoExplosao);
             tempoExplosao = null;
        }
   }
   function explosaoPlayer(playerX, playerY){
        $(".fundoGame").append("<div class='explosaoPlayer'></div>");
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
        $(".fundoGame").append("<div class='explosaoNpc'></div>");
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
        $(".fundoGame").append("<div class='explosaoAmigo'></div>");
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
        if(pontos < 0){
          window.clearInterval(jogo.timer);
          jogo.timer = null;
          pontos = 0;
          $(".player").remove();
          $(".npc").remove();
          $(".inimigo").remove();
          $(".amigo").remove();
          $(".pontos").remove()
          $("#inicio").show();
          pauseTrilha();
        }
   }
   function vitoria(){
        if(pontos>=10){
             window.clearInterval(jogo.timer);
             jogo.timer = null;
             $(".npc").remove();
             $(".inimigo").remove();
             $(".amigo").remove();
             $(".fundoGame").append("<div class='vitoria'><h1>Você ganhou!!</h1></div>");
             pauseTrilha();
          }
   }

   function loop(){
        moveFundo();
        moveJogador();
        moveInimigo();
        moveNpc();
        colisao();
        gameover();
        vitoria();
   }
}