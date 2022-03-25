#/bin/bash

path=$PWD

# Build Line module
build_dir="${PWD}/rust/line"
out_dir="${PWD}/wasm_line"

echo $build_dir
echo $out_dir

wasm-pack build "${build_dir}" --out-dir "${out_dir}" --target web

# Build Circle module
#build_dir="${PWD}/rust/circle"
#out_dir="${PWD}/wasm_circle"

#echo $build_dir
#echo $out_dir

#wasm-pack build "${build_dir}" --out-dir "${out_dir}" --target web

# Build Polygon module
#build_dir="${PWD}/rust/polygon"
#out_dir="${PWD}/wasm_polygon"

#echo $build_dir
#echo $out_dir

#wasm-pack build "${build_dir}" --out-dir "${out_dir}" --target web
