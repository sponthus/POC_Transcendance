# **Proof of concept** : Transcendance

## Description
<table>
  <p align="center">
     <img src="https://upload.wikimedia.org/wikipedia/commons/f/f8/Pong.png" alt="Pong wikipedia image" width="400"/>
  </p>
  </tr>
  <tr>
    <td>
      Transcendance is the last group common core project at 42 school. The goal is to create a website to play <a href="https://fr.wikipedia.org/wiki/Pong">Pong</a>, with a lot of modules around this concept : frontend, DevObs architecture, user authentification and chat, match history, online games and cybersecurity. 
      Therefore, many programming languages and concepts are expected and they are pretty new to me. This repo contains a few researched I've made on these concepts.
    </td>
  </tr>
</table>

## :memo: Status
<p align="center">
  <strong>Ongoing :</strong> <br>
  :star: Confirm global architecture of the project
  :star: Complete game basics to allow work about IA opponent<br>
  :star: Complete user authentification (2 tokens) <br>
  :star: Implement needed databases and REST API
</p>

## :orange_book: Features
+ Basic SPA website with router and back/forward navigation working
+ Basic 3D pong game (local)
+ Basic authentication, 1 token for now
+ Using `docker-compose` to launch the project with micro-services architecture :<br>
     - Nginx
     - Vite server for frontend (temp)
     - Backend server

## :cyclone: Clone
Clone the repository and enter it :
```shell
git clone https://github.com/sponthus/POC_Transcendance
cd Inception
```

## 	:runner: Run
From the project directory, use :
```shell
make
```
Be awarwe that this is a WIP, and not designed to be a finished product : I only do researches on various subjects !

:hugs: Thanx !
---
Made by sponthus
