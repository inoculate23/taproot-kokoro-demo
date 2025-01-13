# Taproot × Kokoro


https://github.com/user-attachments/assets/4065d4c7-d8d9-45c3-bd01-80e4c6b022c0


This repository shows an example of how to interact with a Taproot cluster running Kokoro-TTS directly from the browser for absurdly fast end-to-end speech synthesis, delivering ready-to-play 48KHz audio to the browser in as little as 50 milliseconds.

# Installation

This assumes you have `node.js` and `python` installed. For GPU usage, you will need to have a working CUDA toolkit.

If you don't have it already, you also need to install [espeak-ng](https://github.com/espeak-ng/espeak-ng). The easiest way to do this is to install `espeak-ng` using your system's package manager (`yum`, `apt`, `pacman`). See [here](https://github.com/espeak-ng/espeak-ng/blob/master/docs/guide.md) for complete instructions.

## Step 1 - Install Taproot

```sh
pip install taproot[uv,av]
```

*This command also includes `uv` for speed (linux only) and `av` for audio codecs.*

## Step 2 - Install Kokoro

```sh
taproot install speech-synthesis:kokoro --optional
```

*This command also installs `deepfilternet` (`libdf`) for speech upsampling with the `--optional` flag.*

## Step 3 - Clone Repository

```
git clone git@github.com:painebenjamin/taproot-kokoro-demo.git
```

*See the green "Code" button in this repository for alternative clone commands.*

## Step 4 - Install NPM Packages

```
cd taproot-kokoro-demo
npm install
```

# Running

In the `taproot-kokoro-demo` repository, run node like so:

```
npm start
```

In another window, run Taproot like so:

```sh
taproot overseer --local
```

You can now access the demo at `http://localhost:3000`.
