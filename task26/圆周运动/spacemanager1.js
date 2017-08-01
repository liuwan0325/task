//指挥官
var SpaceShipManager = {
	//用于记录
	noteBook : {
		spaceShipList : [],
		spaceFlyManager : 0,
		solorManager : 0
	},
	//创建宇宙飞船
	//orbitId表示在哪个轨道创建
	//轨道值从0开始
	createSpaceShip : function (orbitId) {
		this.noteBook.spaceShipList.push(new SpaceShip(orbitId));
		var oDiv = document.createElement('div');
		oDiv.id = 'spaceship' + orbitId;
		oDiv.className = 'spaceship spaceship' + orbitId;
		var oEnengy = document.createElement('div');
		oEnengy.className = 'energy';
		var txt = document.createElement('div');
		txt.className = 'txt';
		txt.innerHTML = '能量值：100%';
		oEnengy.appendChild(txt);
		oDiv.appendChild(oEnengy);
		document.body.appendChild(oDiv);
	},
	
	//无线电
	Mediator: {
		sendMessage : function(message) {
			
			//每次信息正常传送的时间需要1秒
			setTimeout(function() {
				//在发射过程中，有30%的信息传送失败（丢包）概率
				if (Math.random() <= 0.3) {
					log('向轨道'+(message.id+1)+'信息传送失败（丢包）命令：'+message.command,'red');
					return;
				}
				log('向轨道'+(message.id+1)+'信息传送成功：'+message.command,'green');
				for (var i = 0; i < SpaceShipManager.noteBook.spaceShipList.length; i++) {
					//如果飞船被毁坏掉，那么不予处理
					if(SpaceShipManager.noteBook.spaceShipList[i]._destroy) {
						continue;
					}
					SpaceShipManager.noteBook.spaceShipList[i].telegraph.sendMessage(message);
				}

			},1000);
		},
		//信号接收，创建宇宙飞船
		createSpaceShip : function(orbitId) {
			setTimeout(function(){
				//在发射过程中，有30%的信息传送失败（丢包）概率
				if (Math.random() <= 0.3) {
					log('命令发送失败,在轨道'+(orbitId+1) +'创建失败','red');
					return;
				}
				//创建飞船信息发送成功
				log('创建飞船信息发送成功,在轨道'+(orbitId+1) +'创建成功','green');
				SpaceShipManager.createSpaceShip(orbitId);
			},1000);
		}
	}
};

//飞船飞行及显示管理
(function(){
	SpaceShipManager.noteBook.spaceFlyManager = setInterval(function(){
		for (var i = 0; i < SpaceShipManager.noteBook.spaceShipList.length; i++) {
			if(SpaceShipManager.noteBook.spaceShipList[i]._destroy) {
				if (!SpaceShipManager.noteBook.spaceShipList.clear) {
					SpaceShipManager.noteBook.spaceShipList.clear = true;
					var ship = document.getElementById('spaceship'+SpaceShipManager.noteBook.spaceShipList[i]._orbitId);
					document.body.removeChild(ship);
				}
				continue;
			}
			SpaceShipManager.noteBook.spaceShipList[i].drive.fly();
			var ship = document.getElementById('spaceship'+SpaceShipManager.noteBook.spaceShipList[i]._orbitId);
			var energyDiv = ship.getElementsByClassName('energy')[0];
			var txt = energyDiv.getElementsByClassName('txt')[0];

			ship.style.transform = 'rotate('+SpaceShipManager.noteBook.spaceShipList[i]._angle+'deg)';
			ship.style.oTransform = 'rotate('+SpaceShipManager.noteBook.spaceShipList[i]._angle+'deg)';
			ship.style.msTransform = 'rotate('+SpaceShipManager.noteBook.spaceShipList[i]._angle+'deg)';
			ship.style.mozTransform = 'rotate('+SpaceShipManager.noteBook.spaceShipList[i]._angle+'deg)';
			ship.style.webkitTransform = 'rotate('+SpaceShipManager.noteBook.spaceShipList[i]._angle+'deg)';
			energyDiv.style.width = SpaceShipManager.noteBook.spaceShipList[i].energy.get() +'px';
			txt.innerHTML='能量：' + SpaceShipManager.noteBook.spaceShipList[i].energy.get() +'%';
				
		
		}
	},100);
})();
//太阳能管理
(function(){
	SpaceShipManager.noteBook.solorManager = setInterval(function(){
		for (var i = 0; i < SpaceShipManager.noteBook.spaceShipList.length; i++) {
			//对已销毁的宇宙飞船不作处理
			if(SpaceShipManager.noteBook.spaceShipList[i]._destroy) {
				continue;
			}
			SpaceShipManager.noteBook.spaceShipList[i].energy.add(2);
			SpaceShipManager.noteBook.spaceShipList[i].energy.consume(5);
			//飞船在停止飞行状态并且能量值满的话，按钮变化为飞行
			if (SpaceShipManager.noteBook.spaceShipList[i]._status == 0) {
				if (SpaceShipManager.noteBook.spaceShipList[i].energy.get() == 100) {
					var oOrdit = document.getElementsByClassName('ordit'+(SpaceShipManager.noteBook.spaceShipList[i]._orbitId+ 1))[0];
					var oBtn = oOrdit.getElementsByTagName('button')[1];
					oBtn.innerHTML = '飞行';
					oBtn.dataset.status = 'start';
				}
			}
			//飞船在飞行状态按钮变化为停止
			if (SpaceShipManager.noteBook.spaceShipList[i]._status == 1) {
					var oOrdit = document.getElementsByClassName('ordit'+(SpaceShipManager.noteBook.spaceShipList[i]._orbitId+ 1))[0];
					var oBtn = oOrdit.getElementsByTagName('button')[1];
					oBtn.innerHTML = '停止';
					oBtn.dataset.status = 'stop';
			}
		}
	},1000);
})();