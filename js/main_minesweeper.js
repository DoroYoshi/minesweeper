'use strict';

$(function () {
  var timer = document.getElementById(`timer`);
  var bomb_remain = document.getElementById(`bomb_remain`);
  var W = 12;
  var H = 12;
  var BOMB = 30;
  var BOMB_fix;
  var cell = [];
  var opened = 0;
  var x_posi;
  var y_posi;
  var open_check;
  var bomb_check;
  var bomb_cnt;
  var bomb_first_set = 0;
  var start_time = 0;
  var timeout_id;
  var ending = 0;
  var flag_mode = 0;

  //選択した難易度に応じて爆弾と配列を変更
  function levelChange() {
    var elements = document.getElementsByName("level");
    console.log(elements);
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].checked) {
        var difficulty = elements[i].value;
        break;
      }
    }
    if (difficulty == "low") {
      W = 9;
      H = 9;
      BOMB = 15;
      BOMB_fix = BOMB;
    } else if (difficulty == "middle") {
      W = 12;
      H = 12;
      BOMB = 30;
      BOMB_fix = BOMB;
    } else {
      W = 15;
      H = 15;
      BOMB = 60;
      BOMB_fix = BOMB;
    }
    //初期値で配置されたテーブルを削除して、新しい数値で再配置
    tableClash();
    countReset();
    initTable();
  }

  //作成したテーブルを全て削除
  function tableClash() {
    $("#main").children().remove();
  }
  //変数を初期値に戻す
  function countReset() {
    bomb_first_set = 0;
    ending = 0;
    opened = 0;
    timer.textContent = "00:00";
    start_time = Date.now();
    $('tbody tr').removeClass('danger');
    var change_img = document.getElementById("change_img");
    change_img.src = 'img/normal.png';
  }
  //初期テーブルの生成
  function initTable() {
    var main = document.getElementById("main");
    for (var i = 0; i < H; i++) {
      cell[i] = [];
      var tr = document.createElement("tr");
      for (var j = 0; j < W; j++) {
        var td = document.createElement("td");
        td.addEventListener("click", click);
        td.addEventListener("doubleClick", doubleClick);
        td.addEventListener("contextMenu", contextMenu);
        td.className = "cell";
        td.y = i;
        td.x = j;
        cell[i][j] = td;
        tr.appendChild(td);
      }
      main.appendChild(tr);
    }
    bomb_remain.textContent = BOMB;
  }

  //爆弾をランダムに配置
  function setBomb() {
    for (var i = 0; i < BOMB; i++) {
      while (true) {
        var x = Math.floor(Math.random() * W);
        var y = Math.floor(Math.random() * H);
        //爆弾が配置されていない、最初に選択したセル以外
        if (!cell[x][y].bomb && x_posi != y && y_posi != x) {
          cell[x][y].bomb = true;
          break;
        }
      }
    }
  }
  //周囲の爆弾の数をカウント
  function countBomb(x, y) {
    var B = 0;
    for (var j = y - 1; j <= y + 1; j++) {
      for (var i = x - 1; i <= x + 1; i++) {
        if (cell[j] && cell[j][i]) {
          if (cell[j][i].bomb) B++;
        }
      }
    }
    return B;
  }
  //周囲のフラグの数をカウント
  function countFlag(x, y) {
    var F = 0;
    for (var j = y - 1; j <= y + 1; j++) {
      for (var i = x - 1; i <= x + 1; i++) {
        if (cell[j] && cell[j][i]) {
          if (cell[j][i].flag) F++;
        }
      }
    }
    return F;
  }
  //タイマー表示
  function countUp() {
    //現在の時間-最初に取得した時間=経過した時間
    const T = new Date(Date.now() - start_time);
    let minutes = T.getMinutes();
    let second = T.getSeconds();
    timer.textContent = `${String(minutes).padStart(2, `0`)}:${String(second).padStart(2, `0`)}`;
    timeout_id = setTimeout(() => {
      countUp();
    }, 1000);
  }
  //旗を立てる
  function raiseFlag(x, y) {
    bomb_check = cell[y][x];
    console.log(bomb_check);
    //既に開いているセルなら処理をせず返す
    if ($(bomb_check).hasClass('open')) {
      return;
      //既に旗が立っていれば旗を削除
    } else if (cell[y][x].flag) {
      $(bomb_check).removeClass('flag');
      $(bomb_check).children().remove();
      cell[y][x].flag = false;
      BOMB += 1;
      bomb_remain.textContent = BOMB;
      //旗を立てる
    } else {
      var td = document.createElement("td");
      td = cell[y][x];
      var flag_img = document.createElement("img");
      flag_img.src = 'img/flag.png';
      td.appendChild(flag_img);
      $(bomb_check).addClass('flag');
      cell[y][x].flag = true;
      BOMB -= 1;
      bomb_remain.textContent = BOMB;
    }
  }

  //クリックされたセルを開く
  function openCell(x, y) {
    open_check = cell[y][x];
    bomb_cnt = countBomb(x, y);
    //既に開いているセルor旗が立っている場合は処理をせず返す
    if (ending != 0 || open_check.flag) {
      return;
      //既に開いており、その数字と周辺の旗の数が一緒なら、free_open起動
    } else if ($(open_check).hasClass('open')) {
      if (open_check.textContent == countFlag(x, y)) {
        freeOpen(x_posi, y_posi);
      }
      return;
      //爆弾の数が1以上のセルはそのセルだけの処理
    } else if (bomb_cnt != 0) {
      allClear(open_check);
      //それぞれの数字に対してclassを付与してHTMLに追記
      if (bomb_cnt == 1) {
        $(open_check).html('<span class="one">' + bomb_cnt + '</span>');
      } else if (bomb_cnt == 2) {
        $(open_check).html('<span class="two">' + bomb_cnt + '</span>');
      } else if (bomb_cnt == 3) {
        $(open_check).html('<span class="three">' + bomb_cnt + '</span>');
      } else if (bomb_cnt == 4) {
        $(open_check).html('<span class="four">' + bomb_cnt + '</span>');
      } else if (bomb_cnt == 5) {
        $(open_check).html('<span class="five">' + bomb_cnt + '</span>');
      } else if (bomb_cnt == 6) {
        $(open_check).html('<span class="six">' + bomb_cnt + '</span>');
      } else if (bomb_cnt == 7) {
        $(open_check).html('<span class="seven">' + bomb_cnt + '</span>');
      } else {
        $(open_check).html('<span class="eight">' + bomb_cnt + '</span>');
      }
    //爆弾が周囲に無い場合はfree_openへ
    } else {
      freeOpen(x_posi, y_posi);
    }
  }

  //8方向のセルを連続して開く
  function freeOpen(x, y) {
    for (var j = y - 1; j <= y + 1; j++) {
      for (var i = x - 1; i <= x + 1; i++) {
        if (cell[j] && cell[j][i]) {
          var c = cell[j][i];
          //既に開いている、爆弾が設置、旗が立っている場合は処理をせず続ける
          if (c.opened || c.bomb || c.flag) {
            continue;
          }
          allClear(c);
          var n = countBomb(i, j);
          if (n == 0) {
            freeOpen(i, j);
          } 
          else {
            if (n == 1) {
              $(c).html('<span class="one">' + n + '</span>');
            } else if (n == 2) {
              $(c).html('<span class="two">' + n + '</span>');
            } else if (n == 3) {
              $(c).html('<span class="three">' + n + '</span>');
            } else if (n == 4) {
              $(c).html('<span class="four">' + n + '</span>');
            } else if (n == 5) {
              $(c).html('<span class="five">' + n + '</span>');
            } else if (n == 6) {
              $(c).html('<span class="six">' + n + '</span>');
            } else if (n == 7) {
              $(c).html('<span class="seven">' + n + '</span>');
            } else {
              $(c).html('<span class="eight">' + n + '</span>');
            }
          }
        }
      }
    }
  }
  //セルを開く際に行う処理
  function allClear(cell) {
    cell.className = "cell open";
    cell.opened = true;
    console.log(opened + "," + W + "," + H + "," + BOMB_fix);
    //クリアー
    if (++opened >= (W * H - BOMB_fix)) {
      clearTimeout(timeout_id);
      ending = 1;
      var change_img = document.getElementById("change_img");
      change_img.src = 'img/clearsmile.png';
    }
  }
  //テーブル内では右クリックメニュー非表示
  $(function () {
    $('#main').on("contextMenu", function (e) {
      return false;
    });
  });
  //右クリック時の操作
  function contextMenu(e) {
    var src = e.currentTarget;
    x_posi = src.x;
    y_posi = src.y;
    raiseFlag(x_posi, y_posi);
  }
  //ダブルクリック時の操作
  function doubleClick(e) {
    var src = e.currentTarget;
    x_posi = src.x;
    y_posi = src.y;
    console.log(x_posi);
    console.log(y_posi);
  }
  //クリック時の操作
  function click(e) {
    if (flag_mode == 0) {
      var src = e.currentTarget;
      x_posi = src.x;
      y_posi = src.y;
      //爆弾を選択したら爆弾を全て表示してゲームオーバー
      if (src.flag) {
        return;
      } else if (src.bomb && ending == 0) {
        cell.forEach(function (tr) {
          tr.forEach(function (td) {
            if (td.bomb) {
              if ($(td).hasClass('flag')) {
                $(td).removeClass('flag');
                $(td).children().remove();
              }
              clearTimeout(timeout_id);
              ending = 1;
              var bomb_img = document.createElement("img");
              bomb_img.src = 'img/bomb.png';
              td.appendChild(bomb_img);
              var change_img = document.getElementById("change_img");
              change_img.src = 'img/explosionface.png';
            }
          })
        });
      } else {
        //最初の1回目をクリックしたらそこ以外に爆弾配置
        if (bomb_first_set == 0) {
          setBomb();
          start_time = Date.now();
          countUp();
        }
        openCell(x_posi, y_posi);
        bomb_first_set += 1;
      }
    } else {
      var src = e.currentTarget;
      x_posi = src.x;
      y_posi = src.y;
      raiseFlag(x_posi, y_posi);
    }
  }
  //難易度選択した際のイベント
  $('#level_btn').click(function () {
    levelChange();
    timer.textContent = "00:00";
  });
  //smileを選択した際のイベント
  $('#restart_btn').click(function () {
    levelChange();
    timer.textContent = "00:00";
  });
  $('#restartone').click(function () {
    levelChange();
    timer.textContent = "00:00";
  });
  $('#restarttwo').click(function () {
    levelChange();
    timer.textContent = "00:00";
  });
  //フラグモードに切り替え
  $('#flag_mode_choice').click(function () {
    console.log("1kai");
    switch (flag_mode) {
      case 0:
        flag_mode = 1;
        break
      case 1:
        flag_mode = 0;
        break
    }
  });
  //最初に必ず実行。初期配置
  window.addEventListener('DOMContentLoaded', function () {
    initTable();
  })
});