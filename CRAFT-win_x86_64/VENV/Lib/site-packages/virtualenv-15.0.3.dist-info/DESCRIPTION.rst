Virtualenv
==========

`Mailing list <http://groups.google.com/group/python-virtualenv>`_ |
`Issues <https://github.com/pypa/virtualenv/issues>`_ |
`Github <https://github.com/pypa/virtualenv>`_ |
`PyPI <https://pypi.python.org/pypi/virtualenv/>`_ |
User IRC: #pypa
Dev IRC: #pypa-dev

Introduction
------------

``virtualenv`` is a tool to create isolated Python environments.

The basic problem being addressed is one of dependencies and versions,
and indirectly permissions. Imagine you have an application that
needs version 1 of LibFoo, but another application requires version
2. How can you use both these applications?  If you install
everything into ``/usr/lib/python2.7/site-packages`` (or whatever your
platform's standard location is), it's easy to end up in a situation
where you unintentionally upgrade an application that shouldn't be
upgraded.

Or more generally, what if you want to install an application *and
leave it be*?  If an application works, any change in its libraries or
the versions of those libraries can break the application.

Also, what if you can't install packages into the global
``site-packages`` directory?  For instance, on a shared host.

In all these cases, ``virtualenv`` can help you. It creates an
environment that has its own installation directories, that doesn't
share libraries with other virtualenv environments (and optionally
doesn't access the globally installed libraries either).

.. comment: 

Release History
===============

15.0.3 (2016-08-05)
-------------------

* Test for given python path actually being an executable *file*, #939

* Only search for copy actual existing Tcl/Tk directories (PR #937)

* Generically search for correct Tcl/Tk version (PR #926, PR #933)

* Upgrade setuptools to 22.0.5

15.0.2 (2016-05-28)
-------------------

* Copy Tcl/Tk libs on Windows to allow them to run,
  fixes #93 (PR #888)

* Upgrade setuptools to 21.2.1.

* Upgrade pip to 8.1.2.


`Full Changelog <https://virtualenv.pypa.io/en/latest/changes.html>`_.

