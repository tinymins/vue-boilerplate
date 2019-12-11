#!/usr/bin/env php
<?php
// 同步 iconfont 的图标资源
// create by hightman
// -------------------------
$fa_i = 'https://at.alicdn.com/t/font_1558663_i3f0ftm4vgs.css';
$fa_svg = '';

/**
 * @param string $url 资源 URL
 * @return bool|string
 */
function fetchIconFontColor($url)
{
    $url = preg_replace('/\.\w+$/', '.js', $url);
    echo 'Download .js file from ', $url, ' ...', PHP_EOL;
    $content = file_get_contents($url);
    if ($content === false) {
        echo 'ERROR: failed to download svg.js.', PHP_EOL;
        exit(-1);
    }

    echo 'Parsing symbol tags ...', PHP_EOL;
    $data = [];
    preg_match_all('#<symbol .+?</symbol>#', $content, $matches, PREG_PATTERN_ORDER);
    foreach ($matches[0] as $part) {
        $pos1 = strpos($part, 'id="');
        if ($pos1 === false) {
            continue;
        }
        $pos1 += 4;
        $pos2 = strpos($part, '"', $pos1);
        $name = substr($part, $pos1, $pos2 - $pos1);
        if (strpos($name, '-tabbar-') !== false) {
            continue;
        }

        $pos1 = strpos($part, 'fill="', $pos1);
        if ($pos1 === false) {
            continue;
        }
        $pos1+= 6;
        $pos2 = strpos($part, '"', $pos1);
        $color = substr($part, $pos1, $pos2 - $pos1);
        $data[$name] = strtolower($color);
    }
    ksort($data);

    echo 'Updating css file ...', PHP_EOL;
    $content = '';
    foreach ($data as $name => $color) {
        $content .= '.' . $name . ' { color: ' . $color . '; }' . PHP_EOL;
    }
    echo 'OK', PHP_EOL;
    return $content;
}

/**
 * @param string $url 资源 URL
 * @param string $outFile 存储位置
 * @return bool
 */
function fetchIconFontUrl($url, $outFile)
{
    if (empty($url)) {
        return;
    }
    $url = preg_replace('/\?.*$/', '', $url);
    if (substr($url, 0, 2) === '//') {
        $url = 'https:' . $url;
    }
    $content = @file_get_contents($url);
    if ($content === false) {
        return false;
    }

    $inDotPos = strrpos($url, '.');
    if ($inDotPos === false) {
        $inDotPos = strlen($url);
    }
    $inExtName = substr($url, $inDotPos + 1);
    switch ($inExtName) {
        case 'css':
            $content = '/* stylelint-disable */' . PHP_EOL . $content . PHP_EOL . fetchIconFontColor($url);
            break;
        case 'js':
            $content = '/* eslint-disable */' . PHP_EOL . $content;
            break;
    }

    $outDotPos = strrpos($outFile, '.');
    if ($outDotPos === false) {
        $outDotPos = strlen($outFile);
    }

    $imports = [];
    preg_match_all('#url\(\'(//.+?)\'#', $content, $matches, PREG_PATTERN_ORDER);
    foreach ($matches[1] as $part) {
        $val = preg_replace('/\?.*$/', '', $part);
        $imports[$part] = substr($val, strrpos($val, '.'));
    }
    foreach ($imports as $key => $value) {
        $saveFile = substr($outFile, 0, $outDotPos) . $value;
        $saveFileBaseName = basename($saveFile);
        if (fetchIconFontUrl($key, $saveFile)) {
            $content = str_replace("'{$key}'", "'./{$saveFileBaseName}'", $content);
        }
    }
    return file_put_contents($outFile, $content);
}

fetchIconFontUrl($fa_i, 'src/fonts/fa-i/index.scss');
fetchIconFontUrl($fa_svg, 'src/fonts/fa-svg/index.js');
