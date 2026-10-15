---
title: 問題への対処とよくある質問
section: troubleshooting
order: 9
description: 値がない場合、設定のエラー、保存の失敗を読み取ります。
---

## 値がない場合を理解する

空きマスとマスクの外のマスはnullです。落ちる石がない段階では動く石もnullです。道具、対象、次の床の指定、ブラックホール、最終の結果は、該当するまでnullのことがあります。見つからない問題の検索はundefinedです。省略された項目は、0やfalseを選んだ約束ではありません。着地予告や道具の予告を描く前に確かめます。

## 設定の確認に対処する

```ts
import { createGame,GemSwapOptionsError } from "@johnmorrisdotca/houseki/gem-swap";
try { createGame({mode:"daily"}); }
catch(error){console.log(error instanceof GemSwapOptionsError ? error.code : String(error));}
```

ジェムスワップとストーンコラプスの毎日の問題には、表示側がUTCの日付を渡します。色の連鎖は`dailyDate`を受け取り、三つの宝石はシードを使います。形や独自の盤面には、幅、高さ、マスクの長さを合わせます。色の連鎖の固定の盤面は見えるマスだけですが、動いている状態には隠れた行もあります。そのまま全体を`createChallenge`に渡しません。三つの宝石のチャレンジには2〜12組の順番が必要です。

## 拒否された操作を調べる

消去や重力の途中は操作を拒否することがあります。phase、legalActions、reasonを読みます。作成時にidがない問題はエラーです。保存の照合が違う場合も、書き換えた結果を受け入れずエラーになります。標準の型付きエラーにはcodeとmessageがあり、回復の選択を示すときも元の説明を保ちます。固定の問題の設定を変えるには自由に遊ぶを選びます。解答の確認は1つの勝ち方の確認で、すべての手順の保証ではありません。
