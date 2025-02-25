"use client"


export interface ComponentFile {
  name: string
  content: string
}

export interface ComponentFolder {
  name: string
  children: (ComponentFile | ComponentFolder)[]
}

export interface Componente {
  nome: string
  descricao: string,
  comoUsar: string
  componente: string
  codigo: ComponentFile | ComponentFolder
  autor: string
  ultimaModificacao: string
  tamanho?: "pequeno" | "normal" | "largo" | "extralargo"
  pasta?: string
  propriedades?: { nome: string; tipo: string; descricao: string; padrao?: string }[]
  metodos?: { nome: string; parametros: string; retorno: string; descricao: string }[]
  exemplos?: { titulo: string; codigo: string }[]
}

export const componentesIniciais: Componente[] = [
  {
    nome: "Use button",
    descricao: "Botão personalizado com ícone de carregamento.",
    comoUsar: `{
                xtype: 'use-searchfield-usuario',
                fieldLabel: 'Usuário',
            }`,
    componente: `
    `,
    codigo: {
      name: "UseButton.js",
      content: `Ext.define('Use.button.Button', {
        extend: 'Ext.button.Button',
        alias: 'widget.use-button',
    
        perms: undefined,
    
        /**
         * @cfg {String}
         * Tamanho do botão, pode ser "medium", "small", "large".
         */
        scale: 'medium',
    
        /**
         * Se o parametro noDisable estiver como false, o componente será desabilitado na ação de visualizar, se true o componente continua ativo.
         */
        noDisable: false,
    
        loadingIconCls: 'icone-loader-buttons-16x16',
    
        initComponent: function () {
            var me = this;
    
            me.callParent();
    
            me.on('afterrender', function() {
                if (this.automatedTestId) {
                    if ( me.btnEl ) {
                        me.btnEl.dom.setAttribute(this.automatedTestIdName, this.automatedTestId);
                    }
                }
            });
    
            me.on({
                render: {
                    fn: me.onRenderButton,
                    scope: me
                }
            });
        },
    
        onRenderButton: function (_this) {
            var me = this;
            _this.getEl().on({
    
                //Colocado o evento keydown no Ext.dom.Element
                keydown: {
                    scope: me,
                    fn: me.onKeyDownButton
                }
    
            });
        },
    
        onKeyDownButton: function (e) {
            this.fireEvent('keydown', this, e);
        },
    
        config: {
            isLoading: false
        },
    
        setIsLoading: function(value) {
            var me = this;
    
            if(!me.rendered) return;
    
            if ( !me.defaultIconCls ) {
                me.defaultIconCls = me.iconCls;
            }
    
            me.callParent(arguments);
    
            me.setDisabled(value);
    
            me.removeCls('x-btn-disabled');
    
            me.setIconCls(value ? me.loadingIconCls : me.defaultIconCls);
        }
    });
        `
    },
    autor: "Useall Core",
    ultimaModificacao: "2024-02-19",
    tamanho: "pequeno",
    propriedades: [
      { nome: "scale", tipo: "string", descricao: "Tamanho do botão, pode ser 'medium', 'small', 'large'" },
      { nome: "noDisable", tipo: "boolean", descricao: "Se o parametro noDisable estiver como false, o componente será desabilitado na ação de visualizar, se true o componente continua ativo." },
      { nome: "loadingIconCls", tipo: "string", descricao: "Classe do ícone de carregamento" },
      { nome: "isLoading", tipo: "boolean", descricao: "Define se o botão está em estado de carregamento" },
    ],
    metodos: [
      {
        nome: "setIsLoading",
        parametros: "value: boolean",
        retorno: "void",
        descricao: "Define se o botão está em estado de carregamento",
      },
    ],
    exemplos: [
      {
        titulo: "Botão com Ícone de Carregamento",
        codigo: `{
          xtype: 'use-button',
          text: 'Teste dos guri',
          listeners: {
              click: ($btn) => {
                  Use.Msg.alert('Botão clicado!');
              }
          }
      }`,
      },
    ]
  }, {
    nome: "Use button",
    descricao: "Botão personalizado com ícone de carregamento.",
    comoUsar: `{
                xtype: 'use-button',
                text: 'Teste dps guri',
                listeners: {
                    click: ($btn) => {
                        Use.Msg.alert('Atenção', 'Botão clicado!');
                    }
                } 
            }`,
    componente: `
    `,
    codigo: {
      name: "UseButton.js",
      content: `Ext.define('Use.button.Button', {
        extend: 'Ext.button.Button',
        alias: 'widget.use-button',
    
        perms: undefined,
    
        /**
         * @cfg {String}
         * Tamanho do botão, pode ser "medium", "small", "large".
         */
        scale: 'medium',
    
        /**
         * Se o parametro noDisable estiver como false, o componente será desabilitado na ação de visualizar, se true o componente continua ativo.
         */
        noDisable: false,
    
        loadingIconCls: 'icone-loader-buttons-16x16',
    
        initComponent: function () {
            var me = this;
    
            me.callParent();
    
            me.on('afterrender', function() {
                if (this.automatedTestId) {
                    if ( me.btnEl ) {
                        me.btnEl.dom.setAttribute(this.automatedTestIdName, this.automatedTestId);
                    }
                }
            });
    
            me.on({
                render: {
                    fn: me.onRenderButton,
                    scope: me
                }
            });
        },
    
        onRenderButton: function (_this) {
            var me = this;
            _this.getEl().on({
    
                //Colocado o evento keydown no Ext.dom.Element
                keydown: {
                    scope: me,
                    fn: me.onKeyDownButton
                }
    
            });
        },
    
        onKeyDownButton: function (e) {
            this.fireEvent('keydown', this, e);
        },
    
        config: {
            isLoading: false
        },
    
        setIsLoading: function(value) {
            var me = this;
    
            if(!me.rendered) return;
    
            if ( !me.defaultIconCls ) {
                me.defaultIconCls = me.iconCls;
            }
    
            me.callParent(arguments);
    
            me.setDisabled(value);
    
            me.removeCls('x-btn-disabled');
    
            me.setIconCls(value ? me.loadingIconCls : me.defaultIconCls);
        }
    });
        `
    },
    autor: "Useall Core",
    ultimaModificacao: "2024-02-19",
    tamanho: "pequeno",
    propriedades: [
      { nome: "scale", tipo: "string", descricao: "Tamanho do botão, pode ser 'medium', 'small', 'large'" },
      { nome: "noDisable", tipo: "boolean", descricao: "Se o parametro noDisable estiver como false, o componente será desabilitado na ação de visualizar, se true o componente continua ativo." },
      { nome: "loadingIconCls", tipo: "string", descricao: "Classe do ícone de carregamento" },
      { nome: "isLoading", tipo: "boolean", descricao: "Define se o botão está em estado de carregamento" },
    ],
    metodos: [
      {
        nome: "setIsLoading",
        parametros: "value: boolean",
        retorno: "void",
        descricao: "Define se o botão está em estado de carregamento",
      },
    ],
    exemplos: [
      {
        titulo: "Botão com Ícone de Carregamento",
        codigo: `{
          xtype: 'use-button',
          text: 'Teste dos guri',
          listeners: {
              click: ($btn) => {
                  Use.Msg.alert('Botão clicado!');
              }
          }
      }`,
      },
    ]
  }]

export default componentesIniciais

