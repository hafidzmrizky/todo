PGDMP  9                	    |            todolist    16.4    16.4     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    36913    todolist    DATABASE     �   CREATE DATABASE todolist WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE todolist;
                mitra_hafidz    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                pg_database_owner    false            �           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   pg_database_owner    false    5            �            1259    36914    session    TABLE     �   CREATE TABLE public.session (
    session_id bigint NOT NULL,
    session character varying(255) NOT NULL,
    name character varying(255) DEFAULT 'user'::character varying NOT NULL,
    last_access timestamp with time zone DEFAULT now()
);
    DROP TABLE public.session;
       public         heap    mitra_hafidz    false    5            �            1259    36921    session_session_id_seq    SEQUENCE        CREATE SEQUENCE public.session_session_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.session_session_id_seq;
       public          mitra_hafidz    false    216    5            �           0    0    session_session_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.session_session_id_seq OWNED BY public.session.session_id;
          public          mitra_hafidz    false    217            �            1259    36942    todo    TABLE     �  CREATE TABLE public.todo (
    session_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    status character varying(255) DEFAULT 'Belum Selesai'::character varying NOT NULL,
    shared boolean DEFAULT false NOT NULL,
    todo_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    start timestamp with time zone NOT NULL,
    "end" timestamp with time zone NOT NULL
);
    DROP TABLE public.todo;
       public         heap    mitra_hafidz    false    5    5    5            �            1259    36927    todo_session_id_seq    SEQUENCE     |   CREATE SEQUENCE public.todo_session_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.todo_session_id_seq;
       public          mitra_hafidz    false    219    5            �           0    0    todo_session_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.todo_session_id_seq OWNED BY public.todo.session_id;
          public          mitra_hafidz    false    218            *           2604    36950    session session_id    DEFAULT     x   ALTER TABLE ONLY public.session ALTER COLUMN session_id SET DEFAULT nextval('public.session_session_id_seq'::regclass);
 A   ALTER TABLE public.session ALTER COLUMN session_id DROP DEFAULT;
       public          mitra_hafidz    false    217    216            -           2604    36951    todo session_id    DEFAULT     r   ALTER TABLE ONLY public.todo ALTER COLUMN session_id SET DEFAULT nextval('public.todo_session_id_seq'::regclass);
 >   ALTER TABLE public.todo ALTER COLUMN session_id DROP DEFAULT;
       public          mitra_hafidz    false    218    219    219            �          0    36914    session 
   TABLE DATA           I   COPY public.session (session_id, session, name, last_access) FROM stdin;
    public          mitra_hafidz    false    216   �       �          0    36942    todo 
   TABLE DATA           W   COPY public.todo (session_id, name, status, shared, todo_id, start, "end") FROM stdin;
    public          mitra_hafidz    false    219   �$       �           0    0    session_session_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.session_session_id_seq', 65, true);
          public          mitra_hafidz    false    217            �           0    0    todo_session_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.todo_session_id_seq', 7, true);
          public          mitra_hafidz    false    218            2           2606    36930    session session_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (session_id);
 >   ALTER TABLE ONLY public.session DROP CONSTRAINT session_pkey;
       public            mitra_hafidz    false    216            5           2606    36953    todo todo_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.todo
    ADD CONSTRAINT todo_pkey PRIMARY KEY (todo_id);
 8   ALTER TABLE ONLY public.todo DROP CONSTRAINT todo_pkey;
       public            mitra_hafidz    false    219            3           1259    36954    fki_session_todo    INDEX     G   CREATE INDEX fki_session_todo ON public.todo USING btree (session_id);
 $   DROP INDEX public.fki_session_todo;
       public            mitra_hafidz    false    219            6           2606    36955    todo session_todo    FK CONSTRAINT     �   ALTER TABLE ONLY public.todo
    ADD CONSTRAINT session_todo FOREIGN KEY (session_id) REFERENCES public.session(session_id) ON DELETE SET NULL;
 ;   ALTER TABLE ONLY public.todo DROP CONSTRAINT session_todo;
       public          mitra_hafidz    false    4658    219    216            �   �  x�}�I�%�q��Q��l�1O���7>��� �Z���N���$tN݉FW�|a�f��C������?��s�>�����������?~���_��}��2��{��K|1{��1����ͯ6,�\���ymf)��tDii�D�r	{x�v����������a%�PN�p��ah��F�9���yf�1�]ev�Iw���e���Z��YRM��O�x|h-����F��Whs�5���|k�!{Z���ZJq����{l)�K�����W�G6/%�*��li�:�'19Ėt��b��f�iv��tѷ�<v�MCJi���_T��O�|���Ok�U/Mlղ��cu���3L�r	I�I��o����/��d��+�j��4t3�l���a��-'�8�n�OC�M랑�6��`�b�aR�ԨW�s�9�s�|���9� ��)0�]Ӧq����k� a�[#�}�^�:��%�̺�A;��{H����-���,m3o+X��;���e2��$^�}�\v�ZI��X��z�3�᳗2���>-T��N��2���g�f��jk�t虴���G�U������I��5��B���L��>)���c�G�~��;�b!��*�A�V�̘�;�e�����Y�Hd�eh�ǻL�Jg1�N�Y؁�&�M�Z�bF�t.=D�h����W�@:|z���i�L�
^��>`��9���	+pOI�N4,4~)����>KY�c4?˘{~�&]s����<l���>�C�:Z�s*Ko#����)5G����O�X}z����W
A�]e�MoRk�5;�)iӭ�%�Sߺ,���ԗj�-_�a|��2�uz���Rٻ���k[���Z�0-�cI�ؙ�������{�˔אj�əZ�sj(c�Уv�s=�M�j�4t��>�-b���Bd�,mߥ{��ΞU������ 
�΋�m#Dwf��{(���ʴ���;ܰj���e*����Z��mo��ʬd*�5�3�Ek�컍��0s�!Ea��si��]�(=��U}�1���c�݆G����+Fo#���Q�V����Y�<j�8�����~�e���b��0�%e�dg�e$4?���<Eb��c/7��r�u�0�'e�=Pxͷ�p�eڱW�9S;z/������)��d?h�ل��2 sAH?��)���,/�q9������%����&d��mN�ٱ����͏)�Y���-7��B@("�\�Ǹ���{����jV�Qll�.yX��r��6�ض�L��2�`M��l�ArY5�\��#u��cg/�n(2��g8e*��DZ��gL^= 	�9q�VCn r��fl�Y��d=�>�����C�Q9̉�0�2�
8� l`H�_q���x�tp�=�N�"K�^%$d^Rx��2 ��͜.��~S;F���<rL1�F��mg���dw7g	�yDT�C@�(�Y�p����֢r���Y���<���2>�v�Z�i����xb|�j�2�+�g�R��O�c��Ʈَ�3\����� �,t�(�:~�7�qŋ�e�2����M�
mQ�,�d���U�c������Ô ��嬋����ʋ����k��2���Q�11�,�X�3��k�X����6�m��Uҫ�נ M��LD��$��Rxhg�7�9�΢��r̶���&��G��)�/��r*=+Wo��tU9�;]}�9>q�ѕ����p�xj�U�^qs�EB뻵y�9?*�q�a;!�=�}���U"�-Ơ���=�eZ{�GA�8*ɣ��e�5��R��wF��k�m+��a@-A���I|@YV"C�X����51���@{_���l�}ߦ^DL�C��ۂB�� |ؔ!FA�sRYG�6g��&A8l4�?�������}�����u����_��̬���仏A/��P�8�R��8r�H^��ud�AC@�S>�`'����z~�T�<�N�K����X��ñ����[�p+�I�r��d(���fD�p�ۀ��2�3R�E��Z�ިvH�XNdxh��������Й���Y�� �ᤤr��(4̗����llq$��Ԥ1C���Q��E��ʷ6S��y� P��r!^@����@W�����L��xF�M�Ͻ'���A%�'�)�𾌾��F0�5<�{HWʨ�jh	��	o�*�<f��J�HӉ=�P�t�
�ZbpLE���Zi��?!_h"K0u<`C�j�;�	�a�Ԉ����ٚL3lG2>/��Iy6�\j'�Ak	h;4P��q�h`�N2HduB	���Ȫd��72�Ge���7��ĞM�מNg �]X�Թ�F�X�S�� ��<�:PA�j���O�M;F�6�Q/�����ghg=Yj%�=<�l?�
�W�����U�uՔQ��^Mg��}�Q��ӎ�o�-�2B?�Z"��A��H���>��߹�:����������\�y;�	�c�4*<��BX��viqM\.E>�Q 3P��Q��/7����(������x����q|���7!�kY
0\Aw�pU�Y 	c}߈�]�������Py�t�ȸN�y4����{=�&�7w�u{�L��\�S��v�H� �1'���z���'>*:�%��y�Oo$�V#����GG���Bq��:e�����BK� PJzOק���@R8��L���5���ÿb��v��d�Cz�3��2����?۠�\�{=e��U�<��.����#hBP	��9��p9�ۅ�^�����0
����;�c/&H���r��M	����^��q��]�FR��.��k�A�����S����eC{+>~3�ݴD�}.������y{����h�aPh�nV�z��sŃlN/l��5�I(�T���zf�X��!"�I��A�u�,�!���!Ovފ(����;GT�i^�|S�_���/�����������<n���*�'�2�Y��	���$�b�0�{Ը�E#�F�?'Iv�u��E�1�pQ*?�^&ȴ鉢m�
���*�H �`q,ˆ�b��D9bl�5}')��?�{�w�齒]eJ�E�i@�m���z���G"d��vh�¡4��[&����\k�,=_���dz�/+�&���#{[X��,j;��{C�X�.�r���ݨz6
���e�0	�'��7Xso:���|O��3����Y�,0/Z�aͷ��bzPW^�Y���gF�<�g��x^0��!����n����~t�%F�2N{���̟߾}��Wh�      �   "  x��XMoc�<˿���oR�`��M�`0���I6mŖ=����S���Ǔw��,����^���e�bs�*���6��*��|������Ճl6��H]�MdU�:(�lS�fRN[o�[j���SZ+M�1K�ڝ�?Q|~D'�Ys���}\O?˭lxp)�:5Q�g�\F����Ƣ����[d�o�{zf�b-_�5���*΀k�^�V�j.1Iir۱��%�%��(m���;�>�0^]�y����w��1Š�S^�֝�^�3ږּ��P�Ko�Ɯ;2l�d���A� �Xk�TmY*�kU�7��s��u� h.����Ƀu���8����wF�]{b�*d.�)�T��2\�T)T��^h�x����a��(O�<h�^T*�1񔭩�jv_�������y9?zsI��6IP�]V.V���$���`c�c����ª�Wf��(ժ�bᮌ����B��^�����+y�7���t�xś�b��L�Z�_@�m6]�@Ù\R�SR>�w�fI� ٥=!,���8Ev��Zb����A;�hT�B��E���4��x��`�6(r(�,��<�)Bډv���^�q`p!�����YЧ�oT����u2�ORU�k�o��ilh"Zұ�8�p�$=���.�h�he#��q@�QAM�	Z#��4���X�<��z<���v.��������d��l1ӜM����r(!������4c���'�'����^=��һ����qA��fk�F�P��};�I����º��3���/2G�>@��*9iԒ�Ҫ!_�;�E���ȴ�uh��%J*�&$Ps�n�P3󚡼|f������ �L��T�bG78����*q��3�~��8�yvu��*���Vۿ?����V���>}��:�w� 2������(Ւ��\�@����������Y�����?+�z
�B�n��"�$�H����8�M��攏�kV�yx����}�;^�O��\������p��{T�:G_�q) "W+<�4�]f\|���͆����|��?�8�fT�����$�]T�x#�B�-�7&��Le;JY��7�����r��u���ru#����F%�10x8ow�)�\M7��v&�9��.���Ro������{�6�l7��(չ��E"�؍���P�F�����[���'�¾���%k�)��E�F
죵���n���@e���Dka�����ڰ���*��0R�C�	�'l�H%j��#�~6���p}Ew�K����u���>��͇z7l�F\��1y��5m�/cxo�qg�rp|����"ɗМ&���=�����/9��V�.佸����T�ސ}Fu�?��T��rQ�������`Q-;Lzv}8h��7�J�F�k��{����	H���؆�qD�&W��2��A��ҝ�9��_��<,�����ڪM�`����󼟺��J�?a�	�$�2�iE ��~����1���M�Q?]�Õ���1�7�CflRN0.Ǳ�Dtv���;�i��9XX���V����q-w�'�=�ʩ�cT9�2��+u��{ث,��!���I�WS�b�}�K���/�?�Tt�J�r�Y8��ʵh�F��F;k�L+>��4۰/�9���wo,F�!��nD�"�:	Y	T�≐sx�R�Ґ7�B�`�=�b5b[�H�?�q���ꕈ�2��Uo{�A��L)d�j�1[Taɘ�����?)ױI���� �5����Ʀ(5!���}H{Dr������<�(���kJI'Ƭ�*\�`�`fc."x6�3�Hٿ��~=?;;��0�     