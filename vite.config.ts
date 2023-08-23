import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath, URL } from 'node:url'
// 实现组件库或内部组件的自动按需引入组件
import components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver as antDesignVueResolver } from 'unplugin-vue-components/resolvers'
// 解决 unplugin-vue-components 插件 加载UI库中无法处理的非组件模块
import usePluginImport from 'vite-plugin-importer'
// 使用Unocss
import unoCss from 'unocss/vite'
import presetUno from 'unocss/preset-uno'
import {resolve} from "path";

// https://vitejs.dev/config/
export default  ({mode}) => {
    const baseUrl = loadEnv(mode, process.cwd()).VITE_BASE_URL;
    return defineConfig({
        plugins: [
            vue(),
            vueJsx(),
            components({
                resolvers: [antDesignVueResolver({ importStyle: false })]
            }),
            usePluginImport({
                libraryName: 'ant-design-vue',
                libraryDirectory: 'es',
                style: (name: any) => `${name}/style/css`
            }),
            unoCss({
                presets: [presetUno()]
            })
        ],
        css: {
            preprocessorOptions: {
                less: {
                    modifyVars: {
                        hack: `true; @import (reference) "${resolve('src/styles/Design/config.less')}";`
                    },
                    javascriptEnabled: true
                }
            }
        },
        server: {
            host: '0.0.0.0',
            port: 8080,
            open: true,
            https: false,
            proxy: {
                '/api': {
                    target: baseUrl,
                    changeOrigin: true,
                    ws: true,
                    rewrite: (path: string) => path.replace(/^\/api/, ''),
                },
            },
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    })
}

