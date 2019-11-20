# Alias-switcher-frontend


Web-app for [alias-switcher](https://github.com/AdamBremholm/alias-switcher) with drag and drop interface for controlling aliases in a pf-sense home-network.

Supports authentication and authorization with jwt tokens. 

## Tech

*[Vuejs](https://vuejs.org/)

*[Vue-draggable](https://github.com/SortableJS/Vue.Draggable)

## Project setup
first: configure .env.local file with: 
VUE_APP_ROOT_API=https://yourownserveradress.com
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### For production
```
docker build . -t user/project
docker run user/project -p 8080:8080
```


