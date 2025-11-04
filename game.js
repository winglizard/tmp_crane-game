const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ======== 画像読み込み ========
const bgImage = new Image();
const craneBody = new Image();
const craneArm = new Image();
//const life = new Image();
const prizeImg = new Image();

bgImage.src = "images/background.png";
craneBody.src = "images/crane_body.png";
craneArm.src = "images/crane_arm.png";
//life.src = "images/life.png";
prizeImg.src = "images/prize1.png";

const buffer = 20; // 当たり判定バッファ

//// ======== 景品フォルダのファイル名一覧 ========
//const prizeImageList = [
//  "prize1.png",
//  "prize2.png",
//  "prize3.png"
//];

//// ======== ランダム景品を選ぶ関数 ========
//function getRandomPrizeImage() {
//  const randomIndex = Math.floor(Math.random() * prizeImageList.length);
//  const prizeImg = new Image();
//  prizeImg.src = `images/prizes/${prizeImageList[randomIndex]}`;
//  return prizeImg;
//}

// ======== 状態変数 ========
let craneX = 50;
let craneY = 0;
let armLength = 0;
let isDropping = false;
let isClosing = false;
let isLifting = false;
let moveLeft = false;
let moveRight = false;
let endflg = false;

//let score = 0;
//let playCount = 0;
//let playLife = 5;
//let lifesize = 20;
let message = "移動：←→ ／ 鈎をおろす：SPACE";

// ======== 景品 ========
let prize = {
  x: canvas.width / 2,
  y: canvas.height - 100,
  size: 100,
  caught: false,
  image: prizeImg
};

// ======== 描画関数 ========
function drawCrane() {
  const wireY = craneY+40;

  // ワイヤー
  ctx.strokeStyle = "gray";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(craneX + 40, wireY);
  ctx.lineTo(craneX + 40, wireY + armLength);
  ctx.stroke();

  // クレーン本体
  if (craneBody.complete) ctx.drawImage(craneBody, craneX, craneY, 80, 60);

  // アーム
  if (craneArm.complete) {
    ctx.drawImage(craneArm, craneX, craneY + 40 + armLength, 80, 60);
  }
}

// ======== 景品描画 ========
function drawPrize() {
  if (prize.image.complete) {
    ctx.drawImage(prize.image, prize.x - prize.size / 2, prize.y - prize.size / 2, prize.size, prize.size);
  }
}

// ======== HUD描画 ========
function drawHUD() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
 // ctx.fillText(`SCORE: ${score}`, 20, 30);
 // ctx.fillText(`PLAYS: ${playCount}`, 20, 60);

  ctx.font = "28px 'Arial Black'";
  ctx.fillStyle = "purple";
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, 150);
  ctx.textAlign = "left";
  
//  // ライフ
//  for (let x = 0; x < playLife; x++){
//  	if (life.complete) ctx.drawImage(life, lifesize + (x * 60), 90, 50, 50);
//  }
}

// ======== 当たり判定 ========
function checkCatch() {
  if(
	( (craneX + 40 - buffer) < (canvas.width / 2 ) && (craneX + 40 + buffer) > (canvas.width / 2))
	&& ( craneY < prize.y + ( prize.size ) )  && !isLifting)
	{
		prize.caught = true;
	}
  
}

// ======== 更新処理 ========
function update() {
if(!endflg){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (bgImage.complete) ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  // クレーン移動
  if (!isDropping && !isLifting) {
    if (moveLeft) craneX -= 4;
    if (moveRight) craneX += 4;
    craneX = Math.max(0, Math.min(700, craneX));
  }

  // 降下処理
  if (isDropping) {
    armLength += 4;
    if (armLength > 330) {
      isDropping = false;
      isClosing = true;
      checkCatch();
      message = "CATCH!";
      setTimeout(() => {
        isLifting = true;
        isClosing = false;
        message = "LIFTING...";
      }, 500);
    }
  }

  // 上昇処理
  if (isLifting) {
    armLength -= 4;
    if (prize.caught) prize.y -= 4;
    if (armLength <= 0) {
      isLifting = false;
      if (prize.caught) {
        //score += 100;
        message = "Happy Birthday";
        prize.caught = false;
		endflg = true;
//        // ランダムに次の景品を選びなおす
//        prize = {
//			x: canvas.width / 2,
//			y: canvas.height - 100,
//			size: 100,
//			caught: false,
//			image: prizeImg
//        };
      } else {
        message = "Miss... Try again!";
      }
    }
  }

  drawPrize();
  drawCrane();
  drawHUD();

  requestAnimationFrame(update);
  }
}

// ======== 操作 ========
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") moveLeft = true;
  if (e.code === "ArrowRight") moveRight = true;
  if (e.code === "Space" && !isDropping && !isLifting) {
    isDropping = true;
    //playCount++;
    message = "GO!";
  }
});
document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft") moveLeft = false;
  if (e.code === "ArrowRight") moveRight = false;
});


update();

