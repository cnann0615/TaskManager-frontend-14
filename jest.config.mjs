// next/jest.js はNext.jsによって提供されるJestの設定を簡単に行うためのヘルパー
import nextJest from "next/jest.js";

// nextJest はNext.jsの設定を読み込むためのディレクトリを指定している
// これを使うことでnext.config.jsや.envをテスト環境に組み込める
const createJestConfig = nextJest({
  dir: "./",
});

// Jestのカスタム設定
/** @type {import('jest').Config} */
const config = {
  // Jestがテストを実行する環境を指定
  testEnvironment: "jest-environment-jsdom",
};

// 作成したJestのカスタム設定をエクスポートする
export default createJestConfig(config);
