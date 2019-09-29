(function () {
	const noop = () => null;

	class AjaxModule {
		doGet({
			      url = '/',
			      body = null,
			      callback = noop
		      } = {}
		) {
			this._ajax({method: 'GET', url, body, callback});
		}

		doPost({
			       url = '/',
			       body = null,
			       callback = noop
		       } = {}
		) {
			this._ajax({method: 'POST', url, body, callback});
		}

        doPut({
                   url = '/',
                   body = null,
                   callback = noop
               } = {}
        ) {
            this._ajax({method: 'PUT', url, body, callback});
        }

		_ajax({
			      method = 'GET',
			      url = '/',
			      body = null,
			      callback = noop
		      } = {}
		) {
			const xhr = new XMLHttpRequest();
			xhr.open(method, url, true);
			xhr.withCredentials = true;

			xhr.addEventListener('readystatechange', function () {
				if (xhr.readyState !== xhr.DONE) return;

				callback(xhr.status, xhr.responseText);
			});

			if (body) {
				xhr.setRequestHeader('Content-type', 'application/json; charset=utf8');
				xhr.send(JSON.stringify(body));
				return;
			}

			xhr.send();
		}
	}

	globalThis.AjaxModule = new AjaxModule();
})();
