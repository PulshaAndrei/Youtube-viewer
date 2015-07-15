# Youtube-viewer
Demo: http://pulshaandrei.github.io/Youtube-viewer/

Задача:

Необходимо создать web-приложение, которое позволяет загружать и просматривать информацию о youtube роликах на основании запроса пользователя. Данные с YouTube REST API получаться с помощью JSONP запроса.

Use case:

Пользователь открывает приложение и видит строку поиска
В строке поиска пользователь набирает интересующую его тему. Например - javascript.
Приложение выполняет запрос к YouTube Rest Api и отображает полученные клипы в виде горизонтального списка.
Список можно листать с помощью мыши в любом месте просто зажав левую кнопку и сделав swipe. Если пользователь сделал несколько быстрых свайпов, приложение перелистывает соответствующее количество страниц. Количество роликов на странице зависит от размера окна. Дополнительным средством навигации является “paging” внизу страницы.
По мере перелистывания страниц, приложение подгружает новые данные
