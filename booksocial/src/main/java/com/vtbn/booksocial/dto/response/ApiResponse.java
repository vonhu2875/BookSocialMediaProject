package com.vtbn.booksocial.dto.response;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
//Nếu chuỗi json có kết quả của trường nào đó là null thì sẽ ko hiển thị trường đó
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    @Builder.Default
    private int code = 1000;
    private String message;
    private T result;
}