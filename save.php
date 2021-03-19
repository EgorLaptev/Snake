<?php 
$gameResult = json_decode(file_get_contents('php://input'));

class Save {
	public function __construct($host, $db, $table, $user, $pass, $opt, $cs) {
		$dsn		= "mysql:host=$host;dbname=$db;charset=$cs";
		$this->pdo 	= new PDO($dsn, $user, $pass, $opt);
	}
	public function load($id) {
		if($this->existRow($id)) {
			$sql = "SELECT * FROM `score` WHERE `id` = $id";
			$resp = $this->pdo->query($sql);
			$result = $resp->fetch(PDO::FETCH_ASSOC);
			print_r(json_encode($result));
		} else print_r(json_encode(['count' => 0]));
	}
	public function upload($score, $id) {
		if($this->existRow($id)) $sql = "UPDATE `score` SET `count` = '$score' WHERE `score`.`id` = $id";
		else $sql = "INSERT INTO `score` (`id`, `count`) VALUES ($id, $score)";
		
		$gameResult = json_decode(file_get_contents('php://input'));

		$score 	= $gameResult->score;
		$id	 	= $gameResult->id;

		$resp = $this->pdo->query($sql);

	}
	private function existRow($id) {
		$exist = $this->pdo->query("SELECT * FROM `score` WHERE `id` = $id")->fetch();
		return ($exist) ? true : false;
	}
}

$obj = new Save('localhost', 'snake', 'score', 'root', '', [], 'utf8');

if(!empty($gameResult->score) && !empty($gameResult->id)) $obj->upload($gameResult->score, $gameResult->id);
else $obj->load($gameResult->id);

?>
