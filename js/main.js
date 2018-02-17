var game = new Phaser.Game(1200, 800, Phaser.CANVAS,'PhaserRPG',this,false,false);

var firstState = 
{
	preload : function()
	{
		game.load.image('background','assets/background.png');
		/*game.load.image('player','assets/spaceship.png');*/
		game.load.image('monster','assets/monstre.png');
		game.load.spritesheet('monsterIdle','assets/monstreIdle-Sheet.png',64,64,8);
		game.load.spritesheet('player','assets/perso-Sheet.png',64,64,36);
		game.load.bitmapFont('carrier_command', 'assets/carrier_command.png', 'assets/carrier_command.xml');
	},

	create : function()
	{
		//Zoom sur le monde
		game.world.scale.setTo(2, 2);
		//Mise en place de la map
		game.add.tileSprite(0,0,1920,1080,'background');
		game.world.setBounds(0, 0, 1920, 1080);

		//Mise en place du monstre
		monster = game.add.sprite(50,50,'monsterIdle',5);
		monster.scale.setTo(1.5,1.5);
		anim = monster.animations.add('idle');
		anim.play(5, true);
		idDialMonster = 1;
		nbLineMonster = 1;

		//Mise en place du joueur
		player = game.add.sprite(200, 200, 'player');
		playerIdle = player.animations.add('idle', [0,1,2,3] , 5, true);
		playerDown = player.animations.add('down', [4,5,6,7,8,9,10,11] , 10, true);
		playerRight = player.animations.add('right', [12,13,14,15,16,17,18,19,20,21,22,23] , 10, true);
		playerLeft = player.animations.add('left', [24,25,26,27,28,29,30,31,32,33,34,35] , 10, true);

		//Mise en place de la physique
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.enable(player);
        game.physics.arcade.enable(monster);

        monster.body.immovable = true;
        monster.body.collideWorldBounds = true;

        //Input
		cursors = game.input.keyboard.createCursorKeys();
		spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); 
		enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

		//Camera
		game.camera.follow(player);

		//Texte 
		bmpText = game.add.bitmapText(monster.body.x-50,monster.body.y-50,'carrier_command','Coucou petite merde',5);
		bmpText.visible = false;

		//Gestion des dialogues
		isDialing = false;
	},

	update: function()
	{
		/* INPUT DEPLACEMENT */ 

		//On arrête le joueur avant de voir quelle touche est press
		player.body.velocity.x = 0;
		player.body.velocity.y = 0;


		//Droite et gauche
	    if (cursors.left.isDown)
	    {
	        player.body.velocity.x = -150;
	        if(!playerLeft.isPlaying)
	        {
	        	player.animations.stop(null,true);
	        	playerLeft.play();
	        }
	    }
	    else if (cursors.right.isDown)
	    {
	        player.body.velocity.x = 150;
	        if(!playerRight.isPlaying)
	        {
	        	player.animations.stop(null,true);
	        	playerRight.play();
	        }
	    }

	    //Haut et bas
	    if (cursors.up.isDown)
	    {
	        player.body.velocity.y = -150;
	    }
	    else if (cursors.down.isDown)
	    {
	        player.body.velocity.y = 150;
	        if(!playerDown.isPlaying && player.body.velocity.x == 0) // On regarde si le joueur ne bouge pas dans X pour l'animation
	        {
	        	player.animations.stop(null,true);
	        	playerDown.play();
	        }
	    }

	    //Si le joueur ne bouge pas on le remet dans sa position idle
	    if(!playerIdle.isPlaying)
		{
			if(player.body.velocity.x == 0 && player.body.velocity.y == 0)
			{
				player.animations.stop(null,true);
				playerIdle.play();
			}
		}


		/* COLLISION */

		//Collision entre le joueur et le monstre
		if(game.physics.arcade.collide(player,monster))
		{
			bmpText.visible = true;
			bmpText.x = monster.body.x-50;
			bmpText.y = monster.body.y-50;
			game.time.events.add(Phaser.Timer.SECOND * 4, function()
			{
				bmpText.visible = false;
			},this);

			if(spacebar.isDown)
			{
				this.monsterDial();
			}
		}
		game.physics.arcade.collide(player,monster);

		/* DIALOGUE */
		
		if(isDialing)
		{
			this.blockInput(true);
			if(enter.isDown)
			{
				enter.enabled = false;
				//Dialogue avec le monstre
				if(nbLineMonster > 1)
				{
					this.monsterDial();
				}
				else
				{
					this.blockInput(false);
					isDialing = false;
				}
			}
		}
	},

	render: function()
	{
		game.debug.text("Collision : "+this.physics.arcade.collide(player,monster), 32, 500);
	},

	monsterDial: function()
	{
		id = idDialMonster;
		line = nbLineMonster;
		switch(id) 
		{
			case 1 : 
				switch(line)
				{
					case 1 : 
						console.log('afficher dialogue 1 ligne 1');
						isDialing = true;
						enter.enabled = true;
						nbLineMonster++;
						break;
					case 2 :
						console.log('afficher dialogue 1 ligne 2');
						enter.enabled = true;
						nbLineMonster++;
						break;
					case 3 :
						console.log('afficher dialogue 1 ligne 3');
						enter.enabled = true;
						nbLineMonster = 1;
						break;
				}
				break;
			case 2 : 
				switch(line)
				{
					case 1 : 
						console.log('afficher dialogue 2 ligne 1');
						break;
					case 2 :
						console.log('afficher dialogue 2 ligne 2');
						break;
				}
				break;
			default:
				console.log('Erreur');
		}
	},

	blockInput(bool)
	{
		spacebar.enabled = !bool;
		cursors.left.enabled = !bool;
		cursors.right.enabled = !bool;
		cursors.up.enabled = !bool;
		cursors.down.enabled = !bool;
	}
}

game.state.add('firstState', firstState);
game.state.start('firstState');