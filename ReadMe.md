getElementById("a")
aのidが付与された要素を取得する

createElement("a")
aという新しい要素を作成する

addEventListener
EventTarget の addEventListener() メソッドは、特定のイベントが対象に配信されるたびに呼び出される関数を設定します。 対象としてよくあるものは Element, Document, Window ですが、イベントに対応したあらゆるオブジェクトが対象になることができます (XMLHttpRequestなど)。

addEventListener() は関数または EventListener を実装したオブジェクトを、呼び出される EventTarget における指定されたイベント種別のイベントリスナーのリストに加えることで動作します。
【構文】
target.addEventListener(type, listener[, options]);
type：対象とするイベントの種類を表す文字列
listener：指定された型のイベントが発生するときに通知 (Event インターフェースに準拠しているオブジェクト) を受け取るオブジェクト。これは、 EventListener インタフェースを実装するオブジェクト、あるいは、単純に、JavaScript の関数でなければなりません。コールバックについて詳しくは、イベントリスナーのコールバックを参照してください。

appendChild
Node.appendChild() メソッドは、特定の親ノードの子ノードリストの末尾にノードを追加します。追加しようとしたノードが既に存在していたら、それは現在の親ノードから除かれ、新しい親ノードに追加されます（他のノードに追加する前にそのノードを親ノードから削除する必要はありません）。

これは、ノードが同時にドキュメントの 2 箇所に存在できないということを意味します。ノードがすでに親を持っている場合、最初にノードが削除された後、新しい位置の末尾に追加されます。Node.cloneNode() は、新しい親の末尾に追加する前に、ノードのコピーを作成するために使用できます。cloneNode で作成したコピーは自動的に同期を保たないことに注意してください。

このメソッドでは、異なるドキュメント間でノードを移動することはできません。異なるドキュメントからノードを末尾に追加したい場合は、document.importNode() メソッドを使用する必要があります。
【構文】
var aChild = element.appendChild(aChild);

removeClass
指定した要素から、CSSクラスを削除す指定
した要素から、CSSクラスを削除する。

Math.random()
Math.random()関数は、0–1（0以上、1未満）の範囲で浮動小数点の擬似乱数を返します。その範囲ではほぼ均一な分布で、ユーザーは範囲の拡大をすることができます。実装側で乱数生成アルゴリズムの初期シードを選択し、ユーザーが初期シードを選択、またはリセットするこることは出来ません。

Math.floor
Math.floor() メソッドは、引数として与えた数以下の最大の整数を返します。

padStart
padStart() メソッドは、結果の文字列が指定した長さになるように、現在の文字列を他の文字列で (必要に応じて繰り返して) 延長します。延長は、現在の文字列の先頭から適用されます。
【構文】
str.padStart(targetLength [, padString])

setTimeout
WindowOrWorkerGlobalScope ミックスインの setTimeout() メソッド (および window.setTimeout の後継) は、指定された遅延の後に関数またはコードの断片を実行するタイマーを設定します。
【構文】
var timeoutID = scope.setTimeout(function[, delay, param1, param2, ...]);