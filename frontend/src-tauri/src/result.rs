use std::fmt::{self, Formatter};

#[derive(serde::Serialize, Debug, PartialEq)]
pub enum ResultCode {
    ERROR,
    SUCCESS,
}

#[derive(serde::Serialize)]
pub struct OperationResult {
    pub content: String,
    pub code: ResultCode,
}

impl fmt::Debug for OperationResult {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "OperationResult {{ content: {}, code: {:?} }}",
            self.content, self.code
        )
    }
}

impl OperationResult {
    pub fn new(content: String, code: ResultCode) -> OperationResult {
        OperationResult { content, code }
    }
}
