/**
*
* Classe de création du menu mobile
*
**/

+function()
{

    'use strict';

    var debug = false;

    // constantes
    var MY_ACCOUNT_ID = 'my-account',
        SHOPPING_CART_ID = 'shopping-cart',
        BODY_CLASS = 'nav-openned',
        DRAGGED_CLASS = 'nav-dragged',
        ANGLE_RESTRINCTION = 90;

    // restrictions d'angle
    var angles = [ 
            (0 - ANGLE_RESTRINCTION / 2),
            (0 + ANGLE_RESTRINCTION / 2),
            (180 - ANGLE_RESTRINCTION / 2),
            (-180 + ANGLE_RESTRINCTION / 2)
        ];

    window.MobileSideNav = function($context, options)
    {
        this.$context = $context;
        this.options = options;
        this._isDrawed = false;

        var _this = this;

        var hammertime = new Hammer($context[0], {});

        hammertime.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL, threshold : 10 });

        hammertime.on('panstart', function(event)
        {
            if(debug) console.log(event.center.x);

            if (_this.CanDrag || event.center.x < 50) {

                _this.CanDrag = true;
                if (!_this._isDrawed) _this.Draw();

                _this.MenuWidth = _this.$menuDOM.outerWidth();
                _this.PanStart = _this.Position;

                $('body').addClass(DRAGGED_CLASS);

                window.cancelAnimationFrame(_this.Inertia);
            }
            
        });

        hammertime.on("pan", function(event)
        {   
            var isH = (event.angle > angles[0] && event.angle < angles[1]) || (event.angle > angles[3] && event.angle > angles[2]);

            if (_this.CanDrag && isH) {
                _this.Move(_this.PanStart + event.deltaX);
                window.cancelAnimationFrame(_this.Inertia);
            }

        });

        hammertime.on('panend', function(event)
        {
            if (_this.CanDrag) {
                _this.CanDrag = false;
     
                if ( event.velocityX > 0.5 || event.velocityX < -0.5) {
                    _this.Inertia = window.requestAnimationFrame(function()
                    {
                        _this.Increment(event.velocityX);
                    });
                }
                else 
                {
                    $('body').removeClass(DRAGGED_CLASS);
                    if ( (_this.PanStart + event.deltaX) > (_this.MenuWidth / 2)) {
                        _this.Open();
                    }
                    else
                    {
                        _this.Close();
                    }
                }
            }
        });

        document.addEventListener("backbutton", function(event)
        {
            if (_this.IsOpenned)
            {
                event.preventDefault();
                _this.Close();
            }
        }); 
    };

    MobileNav.prototype.Increment = function(velocity)
    {
        var ammount = this.Position - (velocity * 10),
        _this = this;

        this.Move(ammount);

        if (ammount <= this.MenuWidth && ammount >= 0 ) {
            _this.Inertia = window.requestAnimationFrame(function()
            {
                _this.Increment(velocity);
            });
        }
        else
        {
            if ( ammount >= _this.MenuWidth ) {
                _this.Open();
            }
            else
            {
                _this.Close();
            }
            $('body').removeClass(DRAGGED_CLASS);
        }
    };

    MobileNav.prototype.Draw = function()
    {
        // on crée l'élément
        var $menuDOM = $(document.createElement('DIV')),
        $iterator;

        // on copie les menus et on les insere
        for (var k in this.options.menus) {

            $iterator = this.options.menus[k].clone();

            if ($iterator[0] && $iterator[0].id) {
                $iterator[0].id += '_mobile';
            };

            $menuDOM.append($iterator);
        };

        $menuDOM[0].id = 'mobile-nav';

        // on append le menu au $context
        this.$context.append($menuDOM);

        // on ajoute l'élément au contexte
        this.options.afterDraw($menuDOM);

        this._isDrawed = true;

        this.MenuWidth = $menuDOM.outerWidth();
        this.$menuDOM = $menuDOM;

        this.Position = 0;
        
        if (debug) console.log(this);
    };

    MobileNav.prototype.Open = function()
    {
        window.cancelAnimationFrame(this.Inertia);

        if(!this._isDrawed)
        {
          this.Draw();  
        }

        this.MenuWidth = this.$menuDOM.outerWidth();

        this.$menuDOM[0].style[Modernizr.prefixed('transform')] = _getTransform(this.MenuWidth);

        this.Position = this.MenuWidth;

        setTimeout(function(){
            this.IsOpenned = true;
        }.bind(this));

        this.CanDrag = true;
            
        $('body').addClass(BODY_CLASS);
    };

    MobileNav.prototype.Close = function()
    {   
        window.cancelAnimationFrame(this.Inertia);

        this.$menuDOM[0].style[Modernizr.prefixed('transform')] = _getTransform(0);

        this.IsOpenned = false;

        this.Position = 0;

        this.CanDrag = false;

        $('body').removeClass(BODY_CLASS);
    };

    MobileNav.prototype.Move = function(ammount)
    {
        if (ammount <= this.MenuWidth && ammount >= 0 ) {
            this.$menuDOM[0].style[Modernizr.prefixed('transform')] = _getTransform(ammount);
            this.Position = ammount;
        }
    };

    function _getTransform(ammount)
    {
        return 'translate3d(' + ammount + 'px, 0px, 0)';
    }
}();