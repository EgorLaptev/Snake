<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<link rel="stylesheet" href="style.css">
</head>
<body>


	<canvas id="canv"></canvas>

	<script src="core.js"></script>
	<script>		
		let Game = new GameCore('canv');

		function loop() {
			Game.loop();
			requestAnimationFrame(loop);
		}

		loop();
	</script>
	

	<script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script>
</body>
</html>