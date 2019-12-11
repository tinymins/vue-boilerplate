/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { UserFull } from "@/api/types/user";
import { HttpResponseData } from "@/api/driver/http";

declare global {
  interface Window {
    chrome?: any;
    app: any;
    __INITIAL_STATE__: HttpResponseData<UserFull>;
  }
}
