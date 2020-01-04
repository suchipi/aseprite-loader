const path = require("path");
const zlib = require("zlib");
const Aseprite = require("ase-parser");

function asepriteLoader(source) {
	const ase = new Aseprite(source, path.basename(this.resourcePath));
	ase.parse();

	const serializableAse = {
		name: ase.name,
		fileSize: ase.fileSize,
		width: ase.width,
		height: ase.height,
		numFrames: ase.numFrames,
		colorDepth: ase.colorDepth,
		numColors: ase.numColors,
		pixelRatio: ase.pixelRatio,
		colorProfile: {
			type: ase.colorProfile.type,
			flag: ase.colorProfile.flag,
			fGamma: ase.colorProfile.fGamma,
		},

		frames: ase.frames.map((frame) => ({
			bytesInFrame: frame.bytesInFrame,
			frameDuration: frame.frameDuration,
			numChunks: frame.numChunks,
			cels: frame.cels.map((cel) => {
				const serializedCel = {
					layerIndex: cel.layerIndex,
					xpos: cel.xpos,
					ypos: cel.ypos,
					opacity: cel.opacity,
					celType: cel.celType,
					w: cel.w,
					h: cel.h,
					// We send this as a string over the wire instead of an array to reduce the output filesize.
					rawCelData: cel.rawCelData
						? cel.rawCelData.toString("utf-8")
						: cel.rawCelData,
				};

				return serializedCel;
			}),
		})),
		layers: ase.layers.map((layer) => ({
			flags: layer.flags,
			type: layer.type,
			layerChildLevel: layer.layerChildLevel,
			blendMode: layer.blendMode,
			opacity: layer.opacity,
			name: layer.name,
		})),
		tags: ase.tags.map((tag) => ({
			name: tag.name,
			from: tag.from,
			to: tag.to,
			animDirection: tag.animDirection,
			color: tag.color,
		})),
		palette: {
			paletteSize: ase.palette.paletteSize,
			firstColor: ase.palette.firstColor,
			lastColor: ase.palette.lastColor,
			colors: ase.palette.colors.map((color) => ({
				red: color.red,
				green: color.green,
				blue: color.blue,
				alpha: color.alpha,
				name: color.name,
			})),
		},
	};

	return `
		var data = ${JSON.stringify(serializableAse)};

		data.frames.forEach(function(frame) {
			frame.cels.forEach(function(cel) {
				if (cel.celType !== 0 && cel.celType !== 2) {
					return;
				}

				var arrayBuffer = new ArrayBuffer(cel.rawCelData.length);
				var view = new Uint8Array(arrayBuffer);
				for (var i = 0, strLen = cel.rawCelData.length; i < strLen; i++) {
					view[i] = cel.rawCelData.charCodeAt(i);
				}
				cel.rawCelData = view;
			});
		});

		module.exports = data;
	`;
}
asepriteLoader.raw = true;

module.exports = asepriteLoader;
