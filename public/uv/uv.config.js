self.__uv$config = {
  prefix: "/uv/service/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/uv/uv.handler.js",
  client: "/uv/uv.client.js",
  bundle: "/uv/uv.bundle.js",
  config: "/uv/uv.config.js",
  sw: "/uv/uv.sw.js",
  inject: [
    {
      host: ".*",
      injectTo: "head",
      html: `<script>(function(){if(window.__fluxiTabShimInstalled)return;window.__fluxiTabShimInstalled=true;const TYPE='fluxi-open-tab';function sourceHref(){try{return window.__uv&&window.__uv.location&&window.__uv.location.href?window.__uv.location.href:location.href}catch(error){return location.href}}function send(url,meta){try{if(!url||String(url).startsWith('javascript:'))return;const absolute=new URL(String(url),sourceHref()).href;window.parent.postMessage(Object.assign({type:TYPE,url:absolute,title:document.title||''},meta||{}),'*')}catch(error){}}const nativeOpen=window.open;window.open=function(url,target,features){send(url,{target:target||'_blank',via:'window.open'});return null};document.addEventListener('click',function(event){const anchor=event.target&&event.target.closest?event.target.closest('a[href]'):null;if(!anchor)return;const wantsTab=anchor.target==='_blank'||event.ctrlKey||event.metaKey||event.shiftKey||event.button===1;if(!wantsTab)return;event.preventDefault();event.stopPropagation();send(anchor.getAttribute('href'),{target:anchor.target||'_blank',via:'link'})},true);document.addEventListener('auxclick',function(event){if(event.button!==1)return;const anchor=event.target&&event.target.closest?event.target.closest('a[href]'):null;if(!anchor)return;event.preventDefault();event.stopPropagation();send(anchor.getAttribute('href'),{target:'_blank',via:'middle-click'})},true);document.addEventListener('submit',function(event){const form=event.target;if(!form||form.target!=='_blank'||!form.action)return;event.preventDefault();event.stopPropagation();send(form.action,{target:'_blank',via:'form'})},true);window.__fluxiNativeOpen=nativeOpen})();<\/script>`,
    },
  ],
};
