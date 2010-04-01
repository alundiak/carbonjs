Carbon.JS picViewer-plugin

Синтаксис:
Q(elems).picViewer();

Описание:
Функция picViewer() позволяет вставлять на страницу красивый анимированный просмотрщик фотографий.
Для работы функции необходимо чтобы были подключены модули animation, dom и utilities, а также плагин shadow.

Функция использует следующую структуру кода для фотографий:
<a href="big1.jpg" title="Описание этой фотографии" class="someclass"><img src="small1.jpg"></a>
<a href="big2.jpg" title="Описание этой фотографии" class="someclass"><img src="small2.jpg"></a>
<a href="big3.jpg" title="Описание этой фотографии" class="someclass"><img src="small3.jpg"></a>
...
big1.jpg, big2.jpg, big3.jpg - url самой картинки, которая будет отображаться в picViewer
small1.jpg, small2.jpg, small3.jpg - превьюшки больших картинок, т.е. то, что будет на странице, и на что будет нажимать пользователь.

Пример для группы фотографий: 
<a href="big1.jpg" title="Описание этой фотографии" class="someclass"><img src="small1.jpg"></a>
<a href="big2.jpg" title="Описание этой фотографии" class="someclass"><img src="small2.jpg"></a>
<a href="big3.jpg" title="Описание этой фотографии" class="someclass"><img src="small3.jpg"></a>
Q(".someclass").picViewer();

Пример для одиночных фотографий: 
<a href="big1.jpg" title="Описание этой фотографии" id="photo1"><img src="small1.jpg"></a>
<a href="big2.jpg" title="Описание этой фотографии" id="photo2"><img src="small2.jpg"></a>
<a href="big3.jpg" title="Описание этой фотографии" id="photo3"><img src="small3.jpg"></a>
Q("#photo1").picViewer();
Q("#photo2").picViewer();
Q("#photo3").picViewer();

Установка:
Создайте папку plugins/picViewer в папке с модулями Carbon.JS и закачайте в неё содержимое trunk папки plugins/picViewer из репозитория фреймворка. Затем необходимо вручную подключить файл carbonjs.plugin.picviewer.packed.js